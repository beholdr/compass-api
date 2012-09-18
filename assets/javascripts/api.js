var CAPI = (function() {
  var self = this;

  self.values = {
    allowedUrls: ['/reference/'],
    compassHome: 'http://compass-style.org/',
    typeTimeout: null,
    hasFocus: null,
    frontTitle: document.title,
    frontContent: null
  };
  self.keys = {
    enter:  13,
    escape: 27,
    up:     38,
    down:   40,
    array:  [13, 27, 38, 40]
  };

  self.init = function() {
    self.elements = {
      article:    $('article'),
      content:    $('#content'),
      panel:      $('#docs_panel'),
      sidebar:    $('#navigation'),
      list:       $('#nav-tree'),
      search:     $('#search'),
      field:      $('#search-field'),
      results:    null,
      window:     $(window)
    };

    self.addEvents();
    self.navInit();
  };

  self.addEvents = function() {
    var searchHeight = self.elements.search.innerHeight();
    self.elements.results = $('<ul>', { id: 'results' }).hide().insertBefore(self.elements.list);

    self.elements.window.resize(function() {
      var winHeight =  self.elements.window.height() - 1,
          listHeight = winHeight - searchHeight;

      self.elements.list.height(listHeight);
      self.elements.results.height(listHeight);
      self.elements.article.height(winHeight);
    })
    .mousemove(function(e) {
      if (e.pageX < self.elements.list.width()) self.elements.field.focus();
    })
    .keydown(function(e) {
      if (e.keyCode == self.keys.escape) {
        self.elements.field.val('').focus();
        self.elements.results.hide();
        self.elements.list.show();
      }
    }).trigger('resize');

    self.elements.field.keyup(function(e) {
      if ($.inArray(e.keyCode, self.keys.array) != -1) {
        self.handleKey(e.keyCode);
      } else {
        self.doSearch();
      }
    })
    .focus(function() {
      self.values.hasFocus = true;
    })
    .blur(function() {
      self.values.hasFocus = false;
      self.elements.results.find('.selected').removeClass('selected');
    }).focus();

    self.elements.window.bind('hashchange', function(e) {
      var state     = e.getState(),
          hasMarkup = /(<([^>]+)>)/ig.test(state.url);

      if (hasMarkup) return;

      if (state.url) {
        self.loadContent(state.url);
      } else {
        self.loadHome();
      }
    }).trigger('hashchange');
  };

  self.navInit = function() {
    $('.module > span', self.elements.list).toggle(
      function() {
        $(this).parent().addClass('opened').children('ul').show();
      },
      function() {
        $(this).parent().removeClass('opened').children('ul').hide();
      }
    );

    self.elements.list.delegate('.module > ul > li', 'click.compass', function() {
      if ($(this).hasClass('active')) return;

      var link = $(this).find('a').attr('href');
      self.cleanActiveNav();
      $(this).addClass('active');
      $.bbq.pushState({ url: self.dehashUrl(link) });
    });

    self.elements.results.delegate('li', 'click.compass', function() {
      var link = $(this).attr('rel');
      self.cleanActiveNav();
      $(this).addClass('active');
      $.bbq.pushState({ url: link });
    });

    self.elements.panel.find('.home-link').click(function(e) {
      $.bbq.pushState({ url: "" });
      e.preventDefault();
    });

    self.elements.article.delegate('a', 'click.compass', function(e) {
      var link = $(this).attr('href');

      // ignore JS links
      if (link.substring(0, 1) == '#') return $(this).hasClass('permalink') ? false : true;

      if (self.urlIsAllowed(link)) {
        $.bbq.pushState({ url: link });
        self.cleanActiveNav();
        e.preventDefault();
      } else if (!self.urlIsAbsolute(link)) {
        link = self.processUrlSlash(link);
        window.location.href = self.values.compassHome + link;
        e.preventDefault();
      }
    });
  };

  self.loadHome = function() {
    if (!self.values.frontContent) return;

    self.cleanActiveNav();
    self.elements.content.html(self.values.frontContent);
    document.title = self.values.frontTitle;
    self.elements.article.scrollTo(0);
    self.elements.panel.find('.home-link').addClass('hidden');
  };

  self.loadContent = function(link) {
    if (!self.values.frontContent) {
      self.values.frontContent = self.elements.content.html();
    }
    link = self.processUrlSlash(link);
    self.elements.content.find('.article').addClass('transparentie');
    self.elements.content.load(link, function(responseText) {
      var hash = self.getUrlHash(link),
          top = hash ? hash : 0,
          docHeight = $('#docs_panel').innerHeight(),
          title = $(responseText).find('h1').text();

      self.elements.article.scrollTo(top, { margin: true, offset: { top: -docHeight } });
      document.title = (title) ? title : self.values.frontTitle;
      SyntaxHighlighter.highlight();
      self.elements.panel.find('.home-link').removeClass('hidden');
      _gaq.push(['_trackPageview', link]);
    });
  };

  self.getUrlHash = function(link) {
    var parser = document.createElement('a');
    parser.href = link;
    return parser.hash ? parser.hash : null;
  };

  self.processUrlSlash = function(link) {
    return (link.substring(0, 1) == '/') ? link.substring(1) : link;
  };

  self.dehashUrl = function(link) {
    var parser = document.createElement('a');
    parser.href = link;
    return parser.pathname;
  };

  self.cleanActiveNav = function() {
    self.elements.sidebar.find('.active').removeClass('active');
  };

  self.urlIsAllowed = function(link) {
    for (url in self.values.allowedUrls) {
      var len = self.values.allowedUrls[url].length;
      if (link.substring(0, len) == self.values.allowedUrls[url]) {
        return true;
      }
    }
    return false;
  };

  self.urlIsAbsolute = function(link) {
    return link.search(/^http[s]?:/i) == -1 ? false : true;
  };

  self.doSearch = function() {
    if (self.values.typeTimeout) {
      clearTimeout(self.values.typeTimeout);
      self.values.typeTimeout = null;
    }
    self.values.typeTimeout = setTimeout(searchHandler, 150);

    function searchHandler() {
      var query = self.elements.field.val();
      if (query.length) {
        self.elements.list.hide();
        self.elements.results.html('').show();

        var lastPos = 100,
            winner = $;

        self.elements.list.find('a').each(function() {
          var el = $(this),
              name = el.text(),
              pos = name.toLowerCase().indexOf(query.toLowerCase());

          if (pos != -1 && self.elements.results.text().indexOf(name) == -1) {
            var li = $('<li>'+ name +'</li>').attr('rel', el.attr('href'))
                      .appendTo(self.elements.results);
            if (pos < lastPos) {
              lastPos = pos;
              winner = li;
            }
          }
          self.elements.results.prepend(winner).children('.selected').removeClass('selected');
          self.elements.results.children('li:first').addClass('selected');
        });
      } else {
        self.elements.results.hide();
        self.elements.list.show();
      }
    }
  };

  self.handleKey = function(key) {
    if (!self.values.hasFocus) return;

    var selVis = self.elements.results.find('.selected:visible');
    if (selVis.length) {
      if (key == self.keys.up && selVis.prev().length) {
        selVis.removeClass('selected').prev().addClass('selected');
      }
      if (key == self.keys.down && selVis.next().length) {
        selVis.removeClass('selected').next().addClass('selected');
      }
      if (key == self.keys.enter) {
        selVis.trigger('click');
      }
    } else {
      // TODO
      /*var catSel = self.elements.list.find('.selected');
      if (catSel.length) {
        if (key == self.keys.up) {
          catSel.removeClass('selected').prev().addClass('selected');
        }
        if (key == self.keys.down) {
          catSel.removeClass('selected').next().addClass('selected');
        }
        if (key == self.keys.enter) {
          catSel.removeClass('selected').children('span').trigger('click');
        }
      } else {
        if (key == self.keys.up) {
          self.elements.list.find('.module:last').addClass('selected');
        }
        if (key == self.keys.down) {
          self.elements.list.find('.module:first').addClass('selected');
        }
      }*/
    }
  };

  return {
    init: self.init
  }
}());

$(function() {
  $('#navigation').load('nav/', function() {
    CAPI.init();
  });
});

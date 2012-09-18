def navtree(level)
  ret = Hash.new

  for item in @items
    if item[:classnames] and item[:classnames][1] == level and item[:framework] and item[:stylesheet]
      mixins = mixins(item)
      for mixin in mixins
        ret = navtree_build(ret, item, mixin, "mixin")
      end

      functions = functions(item)
      for func in functions
        ret = navtree_build(ret, item, func, "function")
      end
    end
  end

  #print ret.to_yaml
  ret
end

# helper function for navtree
def navtree_build(ret, item, el, el_type = "mixin")
  module_name = item[:classnames][2] ? item[:classnames][2] : item[:classnames][1];
  page_name = item[:crumb]

  if !ret[module_name]
    ret[module_name] = {:id => module_name, :children => Hash.new}
    #if item[:deprecated] ret[module_name][:deprecated] = true
  end

  if !ret[module_name][:children][page_name]
    ret[module_name][:children][page_name] = {
      :id => page_name,
      :path => item.identifier,
      :children => Hash.new
    }
    #if item[:deprecated] ret[module_name][:deprecated] = true
  end

  ret[module_name][:children][page_name][:children][el.name] = {
    :signature => el.sass_signature(:none),
    :el_type => el_type
  }

  ret
end

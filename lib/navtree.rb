def navtree(level)
  ret = Hash.new

  for item in @items
    if item[:classnames] and item[:classnames][1] == level and item[:framework]
      # get references from code
      if item[:stylesheet]
        mixins = mixins(item)
        for mixin in mixins
          ret = navtree_build(ret, item, mixin, "mixin")
        end

        functions = functions(item)
        for func in functions
          ret = navtree_build(ret, item, func, "function")
        end
      end

      if item[:documented_functions]
        for func in item[:documented_functions]
          ret = navtree_build(ret, item, func)
        end
      end
    end
  end

  #print ret.to_yaml
  ret
end

# helper function for navtree
def navtree_build(ret, item, el, el_type = "")
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

  el_name = el.respond_to?(:name) ? el.name : el
  ret[module_name][:children][page_name][:children][el_name] = {
    :signature => el.respond_to?(:sass_signature) ? el.sass_signature(:none) : el,
    :el_type => el_type
  }

  ret
end

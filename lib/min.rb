def min_js(files)
  ret = Array.new
  for file_name in files
    ret = ret | @items.select { |i| i.identifier =~ /#{Regexp.escape(file_name)}/ }
  end
  ret.map { |i| ";" + i.compiled_content + "\n" }
end

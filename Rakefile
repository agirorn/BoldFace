require 'rubygems'
require 'rake'

desc "Compile the JavaScript js/BoldFace.js into buld/BoldFace-mini.js"
task :compile_js do
  compile_js("js/BoldFace.js", "build/BoldFace-mini.js")
end

task :compile_js_data do
  compile_js("js/googleWebFonts.js", "build/googleWebFonts.js")
end

task :compile_js_data_small do
  compile_js("js/googleWebFonts_SMALL.js", "build/googleWebFonts.js")
end

def compile_js(in_files, out_file)
  # Thers just somthing wrong withe the minified js from this!!!
  # args = [
  #   ["-jar", "tools/compiler/compiler.jar"],
  #   ["--js_output_file", out_file],
  #   ["--js", in_files],
  #   # ["--warning_level", "VERBOSE"], #This just dosen not work for this hack.
  #   ["--summary_detail_level", "3"]
  # ]
  # command = "java #{args.flatten.join(' ')} 2>&1"
  # puts command
  # output = `#{command}`
  # puts output
  
  `cp #{in_files} #{out_file}`
end


desc "Compile the JavaScript js/BoldFace.js into buld/BoldFace-mini.js"
task :compile_html do
  args = [
    ["-jar", "tools/htmlcompressor-1.5.1.jar"],
    ["html/BoldFace.html"],
    [" > ", "build/BoldFace.html"],
  ]
  command = "java #{args.flatten.join(' ')}"
  puts command
  output = `#{command}`
  puts output
end

desc "Compile the JavaScript js/BoldFace.js into buld/BoldFace-mini.js"
task :compile_sass do
  args = [
    ["--style", "compressed"],
    ["sass/BoldFace.scss"],
    ["build/BoldFace.css"],
  ]
  command = "sass #{args.flatten.join(' ')}"
  puts command
  output = `#{command}`
  puts output
end
task :build_all_small => [:compile_sass, :compile_html, :compile_js_data_small, :compile_js]
task :build_all => [:compile_sass, :compile_html, :compile_js_data, :compile_js]
require 'rubygems'
require 'rake'
require 'uglifier'

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
  
  # `cp #{in_files} #{out_file}`
  
  File.open(out_file, 'w') do |file|
    file.write Uglifier.compile(File.read(in_files))
  end
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

desc "Compile the sass/BoldFace.scss into build/BoldFace.css"
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


desc "Add the compresed html file as a varable into the js file."
task :add_html_to_js => [:compile_js, :compile_html] do
  html = File.read('build/BoldFace.html').gsub!('"', "'")
  # puts html
  # js = [
  #   '(function (window, document) {',
  #   'BoldFace.html = ' + '"' + html + '";',
  #   '}(this, this.document));'
  # ]
  # File.open('build/BoldFace-mini.js', mode="a") do |file|
  #   js.each do |line|
  #     file.puts line
  #   end
  # end
  new_html = 'BoldFace.html = ' + '"' + html + '";'
  new_bookmarklet_host = "BoldFace.bookmarklet_host = 'https://raw.github.com';"
  file_to_fix = 'build/BoldFace-mini.js'

  text = File.read(file_to_fix)
  text.gsub!("BoldFace.mode = 'development';", "BoldFace.mode = 'production';")
  text.gsub!("BoldFace.html = '<div></div>';", new_html)
  text.gsub!("BoldFace.bookmarklet_host = 'http://0.0.0.0:9000';", new_bookmarklet_host)
  File.open(file_to_fix, 'w') { |f| f.write(text) }
  
end



task :build_all_small => [:add_html_to_js, :compile_js_data_small, :compile_js]
task :build_all => [:add_html_to_js, :compile_js_data, :compile_js]
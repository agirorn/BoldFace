require 'rubygems'
require 'rake'
require 'uglifier'

desc "Compile the JavaScript js/BoldFace.js into buld/BoldFace-mini.js"
task :compile_js => [:compile_html] do
  html = File.read('build/BoldFace.html').gsub!('"', "'")
  new_html = 'BoldFace.html = ' + '"' + html + '";'
  new_bookmarklet_host = "BoldFace.bookmarklet_host = 'https://raw.github.com';"

  compile_js("js/BoldFace.js", "build/BoldFace-min.js") do |text|
    text.gsub!("BoldFace.mode = 'development';", "BoldFace.mode = 'production';")
    text.gsub!("BoldFace.html = '<div></div>';", new_html)
    text.gsub!("BoldFace.bookmarklet_host = 'http://0.0.0.0:9000';", new_bookmarklet_host)
  end
end

task :compile_js_data do
  compile_js("js/googleWebFonts.js", "build/googleWebFonts.js")
end

task :compile_js_data_small do
  compile_js("js/googleWebFonts_SMALL.js", "build/googleWebFonts.js")
end

def compile_js(in_files, out_file)
  File.open(out_file, 'w') do |file|
    text = File.read(in_files)
    yield text if block_given?
    file.write Uglifier.compile(text)
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

desc "build the bookmarklet.txt from js/bookmarklet.js"
task :build_bookmarklet do
  uglified_js = Uglifier.compile(File.read('js/bookmarklet.js'))
  bookmarklet = "javascript:#{uglified_js}"
  File.open('bookmarklet.txt', 'w') do |file|
    file.write bookmarklet
  end
end

task :build_all_small => [:compile_js, :compile_js_data_small, :compile_js]
task :build_all => [:compile_js, :compile_js_data, :compile_js]
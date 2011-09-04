#!/usr/bin/env ruby
# ruby local_webserver.rb

require 'rubygems'
require 'bundler/setup'
require 'sinatra/base'
require 'vegas'
require 'uglifier'

class MyApp < Sinatra::Base
  helpers do
    def get_file_content(file_name)
      File.read(file_name)
    end
    
    def enviroment
      if ENV.include?('ENVIROMENT')
        return ENV['ENVIROMENT']
      end
      return 'development'
    end
    
    def production?
      if enviroment == 'production'
        return true
      else
        return false
      end
    end
    
    def get_compressed_html
      args = [
        ["-jar", "tools/htmlcompressor-1.5.1.jar"],
        ["html/BoldFace.html"]
      ]
      command = "java #{args.flatten.join(' ')}"
      output = `#{command}`
      output.gsub!('"', "'")
    end
  end
  
  get '/' do
    content_type Rack::Mime.mime_type('.html'), :charset => 'utf-8'
    get_file_content('BoldFaceStandalone.html') 
  end
  
  get '/agirorn/BoldFace/master/build/BoldFace.html' do
    content_type Rack::Mime.mime_type('.html'), :charset => 'utf-8'
    get_file_content('html/BoldFace.html')
  end
  
  get '/agirorn/BoldFace/master/build/BoldFace.js' do
    content_type Rack::Mime.mime_type('.js'), :charset => 'utf-8'
    text = get_file_content('js/BoldFace.js')
    html = get_compressed_html
    
    new_html = 'BoldFace.html = ' + '"' + html + '";'
    text.gsub!("BoldFace.html = '<div></div>';", new_html)
    production? ? Uglifier.compile(text) : text
  end
  
  get '/agirorn/BoldFace/master/build/BoldFace.css' do
    content_type Rack::Mime.mime_type('.css'), :charset => 'utf-8'
    get_file_content('css/BoldFace.css') 
  end
  
  get '/agirorn/BoldFace/master/build/googleWebFonts.js' do
    content_type Rack::Mime.mime_type('.js'), :charset => 'utf-8'
    text = production? ? get_file_content('js/googleWebFonts.js') : get_file_content('js/googleWebFonts_SMALL.js')
    production? ? Uglifier.compile(text) : text
  end
  
end

Vegas::Runner.new(MyApp, 'my_app', {:port => 9000})

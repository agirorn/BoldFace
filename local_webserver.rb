#!/usr/bin/env ruby
# ruby local_webserver.rb

require 'rubygems'
require 'bundler/setup'
require 'sinatra/base'
require 'vegas'

class MyApp < Sinatra::Base
  helpers do
    def get_file_content(file_name)
      file_content = ''
      File.open(file_name) do |file|
        file_content  = file.collect{|line| line}
      end
      file_content 
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
    file_data = get_file_content('js/BoldFace.js')
    html = File.open('build/BoldFace.html') { |file| file.collect {|line| line} }.join('')
    js = [
      '(function (window, document) {',
      'BoldFace.html = ' + '"' + html + '";',
      '}(this, this.document));'
    ]
    
    file_data + js
  end
  
  get '/agirorn/BoldFace/master/build/BoldFace.css' do
    content_type Rack::Mime.mime_type('.css'), :charset => 'utf-8'
    get_file_content('css/BoldFace.css') 
  end
  
  get '/agirorn/BoldFace/master/build/googleWebFonts.js' do
    content_type Rack::Mime.mime_type('.js'), :charset => 'utf-8'
    get_file_content('js/googleWebFonts_SMALL.js')
  end
  
end

Vegas::Runner.new(MyApp, 'my_app', {:port => 9000})

/*jslint nomen: false, debug: true, evil: false, vars: true, indent: 2 */
/*global $, _, GoogleWebFonts, jQuery, clearInterval: false, clearTimeout: false, document: false, event: false, frames: false, history: false, Image: false, location: false, name: false, navigator: false, Option: false, parent: false, screen: false, setInterval: false, setTimeout: false, window: false, XMLHttpRequest: false */

(function (window, document) {
  
  var BoldFace = {};
  
  BoldFace.version = '0.0.2';
  
  BoldFace.mode = 'development';
  BoldFace.html = '<div></div>';
  BoldFace.bookmarklet_host = 'http://0.0.0.0:9000';
  
  BoldFace.init = function () {
    BoldFace.addLoadingScreen();
    // setTimeout(function() {
      BoldFace.loadDependencies();
      BoldFace.init_after_jQueryIsLoaded();
    // },500);
  };

  BoldFace.loadDependencies = function () {
    BoldFace.load_js('cdnjs.cloudflare.com/ajax/libs/jquery/1.6.2/jquery.min.js');
    BoldFace.load_js('cdnjs.cloudflare.com/ajax/libs/jqueryui/1.8.13/jquery-ui.min.js');
    BoldFace.load_js('cdnjs.cloudflare.com/ajax/libs/underscore.js/1.1.7/underscore-min.js');
    BoldFace.load_app_js('/agirorn/BoldFace/master/build/googleWebFonts.js');
  }
  
  
  BoldFace.addHtmlToBody = function () {
    $('#BoldFace').append($(BoldFace.html));
    $("#BoldFace").draggable({handle: 'h1'});
    BoldFace.setupSelectionList();
    BoldFace.populateFontsList();
    $('#BoldFace div.loading').remove();  // Removing the loading scren.
  };
  
  BoldFace.htmlToBodyReady = function(data, textStatus, jqXHR) {
    $('body').append(data);
    $("#BoldFace").draggable({handle: 'h1'});
    BoldFace.setupSelectionList();
    BoldFace.populateFontsList();
  };
  
  BoldFace.familyClass = function (family) {
    return family.replace(' ', '_');
  };
  
  BoldFace.populateFontsList = function () {
    var elemnet, font_list = $('#BoldFace > #font_list > ul');
    font_list.html('');
    _.each(GoogleWebFonts.items, function (item) {
      elemnet = $('<li>' + item.family + '</li>');
      elemnet.css('font-family', item.family);
      elemnet.addClass(BoldFace.familyClass(item.family));
      font_list.append(elemnet);
    });
  };
  
  BoldFace.setupSelectionList = function () {
    $('body').bind('keydown', BoldFace.move_list_up_or_down);
    $('#BoldFace > #font_list').click(BoldFace.select_item);
    $('#BoldFace .size ul').click(BoldFace.select_item);
    $('body').click(function () { 
      $('#BoldFace .focused').removeClass('focused'); 
    });
  };
  
  BoldFace.move_list_up_or_down = function (e) { 
    var selected, next_to_select, focused = $('.focused');
    if (focused.length >= 1) {
      selected = focused.find('.selected');
      if (e.which === 40) {
        if (selected.parent().children('li').index(selected) !== selected.siblings().length) {
          next_to_select = selected.next();
          $(next_to_select).addClass('selected');
          $(selected).removeClass('selected');
          BoldFace.selectionChanged();
          return false;
        }
        return false;
      } else if (e.which === 38) {
        if (selected.parent().children('li').index(selected) !== 0) {
          next_to_select = selected.prev();
          $(next_to_select).addClass('selected');
          $(selected).removeClass('selected');
          BoldFace.selectionChanged();
          return false;
        }
      }
    }
  };

  BoldFace.select_item = function (e) {
    e.preventDefault();
    $(e.target).parent().find('.selected').removeClass('selected');
    $('#BoldFace .focused').removeClass('focused');
    $(e.target).parent().addClass('focused');
    $(e.target).parent('.focused').find('.selected').removeClass('selected');
    $(e.target).addClass('selected');
    BoldFace.selectionChanged();
    return false;
  };
  
  BoldFace.loadGoogleWebFonts = function () {
    _.each(GoogleWebFonts.items, BoldFace.loadGoogleWebFont);
  };
  
  BoldFace.loadGoogleWebFont = function (font) {
    var herf_family,
        link,
        base_href = "http://fonts.googleapis.com/css?family=",
        head = $('head');
    herf_family = font.family.replace(/ /g, '+');
    link = $("<link rel='stylesheet' type='text/css'>");
    href = base_href + herf_family
    if (font.variants.length > 1) {
      href = href + ':' + _.select(font.variants, function(item){ return !(item === "regular"); }).join(',');
    }
    link.attr('href', href);
    head.append(link);
  };
  
  BoldFace.selectionChanged = function () {
    var selector = $('#BoldFace .selector').val();
    var elements = $(selector).filter(':not(#BoldFace *)');
    elements.css('font-family', $('#BoldFace #font_list .selected').text());
    elements.css('font-size', $('#BoldFace .size ul .selected').text());
    var font_name = $('#BoldFace #font_list .selected').text();
    var font = _.detect(GoogleWebFonts.items, function(item){return item.family === font_name;});
    if (font_name !== '') {
      BoldFace.setVariants(font);
    }
  };
  
  BoldFace.setVariants = function (font) {
    var element, select = $('.variants select');
    select.html('');
    _.each(font.variants, function(item){
      element = $('<option>' + item + '</option>');
      select.append(element);
    });
  };
  
  BoldFace.setSubsets = function (font) {
    var element, select = $('.subsets select');
    select.html('');
    _.each(font.subsets, function(item){
      element = $('<option>' + item + '</option>');
      select.append(element);
    });
  };
  
  BoldFace.load_js = function (javascript) {
    var s, js = document.createElement('script');
    js.src = ('https:' === document.location.protocol ? 'https' : 'http') + '://' + javascript;
    js.type = 'text/javascript';
    js.async = 'true';
    s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(js, s);    
  };
  
  BoldFace.load_js_https = function (javascript) {
    var s, js = document.createElement('script');
    js.src = 'https://' + javascript;
    js.type = 'text/javascript';
    js.async = 'true';
    s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(js, s);    
  };
  
  BoldFace.load_app_js = function (javascript) {
    var s, js = document.createElement('script');
    js.src = BoldFace.bookmarklet_host + javascript;
    js.type = 'text/javascript';
    js.async = 'true';
    s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(js, s);    
  };
  
  BoldFace.load_app_css = function (css_file) {
    var css;
    css_file = BoldFace.bookmarklet_host + css_file;
    css = document.createElement('link');
    css.rel = "stylesheet"
    css.type = "text/css" 
    css.href = css_file;
    document.getElementsByTagName('head')[0].appendChild(css);
  };
  
  BoldFace.checkFor_jQuery = function () {
    if (typeof(window.jQuery) !== 'undefined') {
      if (typeof(window.GoogleWebFonts) !== 'undefined') {
        clearInterval(BoldFace.checkFor_jQueryInterval);
        jQuery(document).ready(function ($) {
          BoldFace.addHtmlToBody();
          BoldFace.loadGoogleWebFonts();
        });
      }
    }
  };
  
  BoldFace.init_after_jQueryIsLoaded = function() {
    BoldFace.checkFor_jQueryInterval = setInterval(BoldFace.checkFor_jQuery, 100);
  }
  
  BoldFace.addLoadingScreen = function () {
    var div, loading, message;
    BoldFace.load_app_css('/agirorn/BoldFace/master/build/BoldFace.css');
    
    div = document.createElement('div');
    div.id = 'BoldFace';
    
    loading = document.createElement('div');
    loading.classList.add('loading');
    div.appendChild(loading);
    
    message = document.createElement('p');
    message.classList.add('message');
    loading.appendChild(message);
    
    document.getElementsByTagName('body')[0].appendChild(div);
    BoldFace.animateLoading();
  };
  
  BoldFace.animateLoading = function () {
    var bold_face = document.getElementById('BoldFace');
    if (typeof(bold_face) !== 'undefined') {
      var message = bold_face.getElementsByClassName('message')[0];
      if (typeof(message) !== 'undefined') {
        if (message.textContent === '') {
          message.textContent = 'Loading';
        } else if (message.textContent === 'Loading') {
          message.textContent = 'Loading.';
        } else if (message.textContent === 'Loading.') {
          message.textContent = 'Loading..';
        } else if (message.textContent === 'Loading..') {
          message.textContent = 'Loading...';
        } else if (message.textContent === 'Loading...') {
          message.textContent = 'Loading....';
        } else if (message.textContent === 'Loading....') {
          message.textContent = 'Loading.....';
        } else if (message.textContent === 'Loading.....') {
          message.textContent = 'Loading.';
        }
        window.setTimeout(BoldFace.animateLoading, 300);
      }
    }
  };
  
  // Lest make it global
  window.BoldFace = BoldFace;
  
  // Finaly run BoldFace.
  BoldFace.init();
}(this, this.document));

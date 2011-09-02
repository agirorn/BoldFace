/*jslint nomen: false, debug: true, evil: false, vars: true, indent: 2 */
/*global $, _, GoogleWebFonts, jQuery, clearInterval: false, clearTimeout: false, document: false, event: false, frames: false, history: false, Image: false, location: false, name: false, navigator: false, Option: false, parent: false, screen: false, setInterval: false, setTimeout: false, window: false, XMLHttpRequest: false */

(function (window, document) {
  
  var BoldFace = {};
  BoldFace.mode = 'production';
  
  BoldFace.bookmarklet_host = function () {
    if (BoldFace.mode === 'development') {
      return 'http://0.0.0.0:9000';
    } else {
      return 'https://raw.github.com';
    }
  };
  
  BoldFace.version = '0.0.1';
  BoldFace.init = function () {
    BoldFace.addHtmlToBody();
    BoldFace.loadGoogleWebFonts();
  };
  
  
  BoldFace.addHtmlToBody = function () {
    // var element;
    // element = $("<div id='BoldFace'><h1>BoldFace</h1><div id='font_list'><ul class='fontList'></ul></div><div><div class='property'><div class='name'><span>Family: </span><span>Abel</span></div><div class='variants'><span>Variants: </span><span><select multiple><option>regular</option></select></span></div><div class='subsets'><span>Subsets: </span><span><select multiple><option>latin</option></select></span></div>      <div class='size'><span>Size: </span><span><ul><li>8px</li><li>10px</li><li>12px</li><li>14px</li><li>16px</li><li>20px</li><li>22px</li><li>24px</li><li>26px</li><li>28px</li></ul></span></div></div></div></div>");
    // $('body').append(element);
    // 
    var url = BoldFace.bookmarklet_host() + '/agirorn/BoldFace/master/build/BoldFace.html';
    console.log(url);
    $.ajax({
      url: url,
      // context: document.body,
      success: BoldFace.htmlToBodyReady
    });
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
      selected = $('.selected');
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
    $('#BoldFace .focused .selected').removeClass('selected');
    $('#BoldFace .focused').removeClass('focused');
    $(e.target).parent().addClass('focused');
    $(e.target).parent('.focused').find('.selected').removeClass('selected');
    $(e.target).addClass('selected');
    BoldFace.selectionChanged();
    return false;
  };
  
  BoldFace.loadGoogleWebFonts = function () {
    var herf_family,
        link,
        base_href = "http://fonts.googleapis.com/css?family=",
        head = $('head');
    _.each(GoogleWebFonts.items, function (font) {
      herf_family = font.family.replace(/ /g, '+');
      link = $("<link rel='stylesheet' type='text/css'>");
      link.attr('href', base_href + herf_family);
      head.append(link);
    });
  };
  
  BoldFace.selectionChanged = function () {
    var elements = $('*').filter(':not(#BoldFace *)');
    elements.css('font-family', $('#BoldFace #font_list .selected').text());
    elements.css('font-size', $('#BoldFace .size ul .selected').text());
  };
  
  function load_js(javascript) {
    var s, js = document.createElement('script');
    js.src = ('https:' === document.location.protocol ? 'https' : 'http') + '://' + javascript;
    js.type = 'text/javascript';
    js.async = 'true';
    s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(js, s);    
  }
  function load_js_https(javascript) {
    var s, js = document.createElement('script');
    js.src = 'https://' + javascript;
    js.type = 'text/javascript';
    js.async = 'true';
    s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(js, s);    
  }
  
  function load_app_js(javascript) {
    var s, js = document.createElement('script');
    js.src = BoldFace.bookmarklet_host() + javascript;
    js.type = 'text/javascript';
    js.async = 'true';
    s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(js, s);    
  }
  function load_app_css(css_file) {
    var css;
    css_file = BoldFace.bookmarklet_host() + css_file;
    css = document.createElement('link');
    css.rel = "stylesheet"
    css.type = "text/css" 
    css.href = css_file;
    document.getElementsByTagName('head')[0].appendChild(css);
  }
  
  load_js('cdnjs.cloudflare.com/ajax/libs/jquery/1.6.2/jquery.min.js');
  load_js('cdnjs.cloudflare.com/ajax/libs/jqueryui/1.8.13/jquery-ui.min.js');
  load_js('cdnjs.cloudflare.com/ajax/libs/underscore.js/1.1.7/underscore-min.js');
  load_app_js('/agirorn/BoldFace/master/build/googleWebFonts.js');
  load_app_css('/agirorn/BoldFace/master/build/BoldFace.css');
  
  BoldFace.checkFor_jQuery = function () {
    if (typeof(window.jQuery) !== 'undefined') {
      if (typeof(window.GoogleWebFonts) !== 'undefined') {
        clearInterval(BoldFace.checkFor_jQueryInterval);
        jQuery(document).ready(function ($) {
          BoldFace.init();
        });
      }
    }
  };
  
  BoldFace.checkFor_jQueryInterval = setInterval(BoldFace.checkFor_jQuery, 100);
  
  // Lest make it global
  window.BoldFace = BoldFace;
}(this, this.document));

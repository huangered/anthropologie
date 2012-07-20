   /* =============================================================
 * bootstrap-typeahead.js v2.0.2
 * http://twitter.github.com/bootstrap/javascript.html#typeahead
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */
	if(!Array.indexOf){
	    Array.prototype.indexOf = function(obj){
	        for(var i=0; i<this.length; i++){
	            if(this[i]==obj){
	                return i;
	            }
	        }
	        return -1;
	    }
	}
	
!function( $ ){

  "use strict"

  var Typeahead = function ( element, options ) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.typeahead.defaults, options)
    this.matcher = this.options.matcher || this.matcher
    this.sorter = this.options.sorter || this.sorter
    this.highlighter = this.options.highlighter || this.highlighter
    this.$menu = $(this.options.menu).appendTo('body')
    this.source = this.options.source
    this.shown = false
    this.listen()
  }

  Typeahead.prototype = {

    constructor: Typeahead

  , select: function () {
      var val = this.$menu.find('.active').attr('data-value')
      this.$element.val(val)
      this.$element.change();
      return this.hide()
    }

  , show: function () {
      var pos = $.extend({}, this.$element.offset(), {
        height: this.$element[0].offsetHeight
      })

      this.$menu.css({
        top: pos.top + pos.height
      , left: pos.left
      })

      this.$menu.show()
      this.shown = true
      return this
    }

  , hide: function () {
      this.$menu.hide()
      this.shown = false
      return this
    }

  , lookup: function (event) {
      var that = this
        , items
        , q

      this.query = this.$element.val()

      if (!this.query) {
        return this.shown ? this.hide() : this
      }

      items = $.grep(this.source, function (item) {
        if (that.matcher(item)) return item
      })

      items = this.sorter(items)

      if (!items.length) {
        return this.shown ? this.hide() : this
      }

      return this.render(items.slice(0, this.options.items)).show()
    }

  , matcher: function (item) {
      return ~item.toLowerCase().indexOf(this.query.toLowerCase())
    }

  , sorter: function (items) {
      var beginswith = []
        , caseSensitive = []
        , caseInsensitive = []
        , item

      while (item = items.shift()) {
        if (!item.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
        else if (~item.indexOf(this.query)) caseSensitive.push(item)
        else caseInsensitive.push(item)
      }

      return beginswith.concat(caseSensitive, caseInsensitive)
    }

  , highlighter: function (item) {
      return item.replace(new RegExp('(' + this.query + ')', 'ig'), function ($1, match) {
        return '<strong>' + match + '</strong>'
      })
    }

  , render: function (items) {
      var that = this

      items = $(items).map(function (i, item) {
        i = $(that.options.item).attr('data-value', item)
        i.find('a').html(that.highlighter(item))
        return i[0]
      })

      items.first().addClass('active')
      this.$menu.html(items)
      return this
    }

  , next: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , next = active.next()

      if (!next.length) {
        next = $(this.$menu.find('li')[0])
      }

      next.addClass('active')
    }

  , prev: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , prev = active.prev()

      if (!prev.length) {
        prev = this.$menu.find('li').last()
      }

      prev.addClass('active')
    }

  , listen: function () {
      this.$element
        .on('blur',     $.proxy(this.blur, this))
        .on('keypress', $.proxy(this.keypress, this))
        .on('keyup',    $.proxy(this.keyup, this))

      if ($.browser.webkit || $.browser.msie) {
        this.$element.on('keydown', $.proxy(this.keypress, this))
      }

      this.$menu
        .on('click', $.proxy(this.click, this))
        .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
    }

  , keyup: function (e) {
      switch(e.keyCode) {
        case 40: // down arrow
        case 38: // up arrow
          break

        case 9: // tab
        case 13: // enter
          if (!this.shown) return
          this.select()
          break

        case 27: // escape
          if (!this.shown) return
          this.hide()
          break

        default:
          this.lookup()
      }

      e.stopPropagation()
      e.preventDefault()
  }

  , keypress: function (e) {
      if (!this.shown) return

      switch(e.keyCode) {
        case 9: // tab
        case 13: // enter
        case 27: // escape
          e.preventDefault()
          break

        case 38: // up arrow
          e.preventDefault()
          this.prev()
          break

        case 40: // down arrow
          e.preventDefault()
          this.next()
          break
      }

      e.stopPropagation()
    }

  , blur: function (e) {
      var that = this
      setTimeout(function () { that.hide() }, 150)
    }

  , click: function (e) {
      e.stopPropagation()
      e.preventDefault()
      this.select()
    }

  , mouseenter: function (e) {
      this.$menu.find('.active').removeClass('active')
      $(e.currentTarget).addClass('active')
    }

  }


  /* TYPEAHEAD PLUGIN DEFINITION
   * =========================== */

  $.fn.typeahead = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('typeahead')
        , options = typeof option == 'object' && option
      if (!data) $this.data('typeahead', (data = new Typeahead(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.typeahead.defaults = {
    source: []
  , items: 8
  , menu: '<ul class="typeahead dropdown-menu"></ul>'
  , item: '<li><a href="#"></a></li>'
  }

  $.fn.typeahead.Constructor = Typeahead


 /* TYPEAHEAD DATA-API
  * ================== */

  $(function () {
    $('body').on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
      var $this = $(this)
      if ($this.data('typeahead')) return
      e.preventDefault()
      $this.typeahead($this.data())
    })
  })

}( window.jQuery );

	 function validateFields() {
		 	var compcountries = $("#COUNTRY").attr("data-source");
	 		var comparray = compcountries.split('","');
		 	var x = 0;
		 	$(".control-group").removeClass("error");
			$(".help-inline").html("");
		// check first name
		if (document.compform.FNAME.value == '') {
			$("#FNAME").parents(".control-group").addClass("error").find("span").html("Please enter your first name.");
			var x = 1;
		}
		// check last name
		if (document.compform.LNAME.value == '') {
			$("#LNAME").parents(".control-group").addClass("error").find("span").html("Please enter your last name.");
			var x = 1;
		}
		// check house
		if (document.compform.HOUSE.value == '') {
			$("#HOUSE").parents(".control-group").addClass("error").find("span").html("Please enter your house name or number.");
			var x = 1;
		}
		// check address1
		if (document.compform.ADDRESS.value == '') {
			$("#ADDRESS").parents(".control-group").addClass("error").find("span").html("Please enter the first line of your address.");
			var x = 1;
		}
		/*
		// check address2
		if (document.compform.ADDRESS_2.value == '') {
			$("#ADDRESS_2").parents(".control-group").addClass("error").find("span").html("Please enter the second line of your address.");
			var x = 1;
		}
		// check town
		if (document.compform.CITY.value == '') {
			$("#CITY").parents(".control-group").addClass("error").find("span").html("Please enter your town or city.");
			var x = 1;
		}
		// check county
		if (document.compform.COUNTY.value == '') {
			$("#COUNTY").parents(".control-group").addClass("error").find("span").html("Please enter your county.");
			var x = 1;
		}
		*/
		// check postcode
		if (document.compform.ZIP.value == '') {
			$("#ZIP").parents(".control-group").addClass("error").find("span").html("Please enter your postcode.");
			var x = 1;
		}
		// check country
		if (comparray.indexOf(document.compform.COUNTRY.value) < 0) {
			var isitthere = comparray.indexOf(document.compform.COUNTRY.value);
			$("#COUNTRY").parents(".control-group").addClass("error").find("span").html("Please enter a valid country, perhaps you meant the United Kingdom?");
			var x = 1;
		}
		if (document.compform.COUNTRY.value == '') {
			$("#COUNTRY").parents(".control-group").addClass("error").find("span").html("Please enter your country.");
			var x = 1;
		}
		// check email
		var custEmail = document.compform.EMAIL.value;
		if (custEmail == '') {
			$("#EMAIL").parents(".control-group").addClass("error").find("span").html("Please enter your email.");
			var x = 1;
		}
		if ((custEmail.indexOf('@') < 0) || ((custEmail.charAt(custEmail.length-4) != '.') && (custEmail.charAt(custEmail.length-3) != '.'))) {
			$("#EMAIL").parents(".control-group").addClass("error").find("span").html("Please enter a valid email.");
			var x = 1;
		}
		if (x == 0) {
			if (!document.compform.tcCheckbox.checked) {
				alert("Please read and agree to our Terms & Conditions.");
				return;
			} else {
				document.compform.submit();	
			}
		}	
	 }
(function( $, undefined ) {
	/*
	 *
	 * Bootstrap Wizard 0.5
	 * Adapted under GPL from http://wijmo.com/
	 *
	 * Depends:
	 *	jquery-1.4.2.js (or greater)
	 *  Bootstrap Modal
	 *	jquery.ui.widget.js
	 *	jquery.cookie.js
	 *
	 */
$.widget("bootstrap.bwizard", {
	options: {
		/// <summary>
		/// Determines whether panels are automatically displayed in order.
		/// </summary>
		autoPlay: false,
		/// <summary>
		/// Determines the time span between panels in autoplay mode.
		/// </summary>
		delay: 3000,
		/// <summary>
		/// Determines whether start from the first panel
		/// when reaching the end in autoplay mode.
		/// </summary>
		loop: false,
		/// <summary>
		/// This is an animation option for hiding the panel content.
		/// </summary>
		// e.g. { blind: true, fade: true, duration: 200}
		hideOption: { fade: true },
		/// <summary>
		/// This is an animation option for showing the panel content.
		/// </summary>
		// e.g. { blind: true, fade: true, duration: 200}
		showOption: { fade: true, duration: 400 },
		/// <summary>
		/// Additional Ajax options to consider when
		/// loading panel content (see $.ajax).
		/// </summary>
		ajaxOptions: null,
		/// <summary>
		/// Whether or not to cache remote bwizard content;
		/// Cached content is being lazy loaded; e.g once and
		/// only once for the panel is displayed.
		/// Note that to prevent the actual Ajax requests from being cached
		/// by the browser you need to provide an extra cache:
		/// false flag to ajaxOptions.
		/// </summary>
		cache: false,
		/// <summary>
		/// Store the latest active index in a cookie.
		/// The cookie is then used to determine the initially active index
		/// if the activeIndex option is not defined.
		/// Requires cookie plugin. The object needs to have key/value pairs
		/// of the form the cookie plugin expects as options.
		/// </summary>
		// e.g. { expires: 7, path: '/', domain: 'jquery.com', secure: true }
		cookie: null,
		/// <summary>
		/// HTML template for step header when a new panel is added with the
		/// add method or  when creating a panel for a remote panel on the fly.
		/// </summary>
		stepHeaderTemplate: '',
		/// <summary>
		/// HTML template from which a new panel is created
		/// by adding a panel with the add method or
		/// when creating a panel for a remote panel on the fly.
		/// </summary>
		panelTemplate: '',
		/// <summary>
		/// The HTML content of this string is shown in a panel
		/// while remote content is loading.
		/// Pass in empty string to deactivate that behavior.
		/// </summary>
		spinner: '',
		/// <summary>
		/// A value that indicates the text of back button.
		/// Code example:
		/// $("#element").bwizard("option", "backBtnText", "Back Button");
		/// </summary>
		backBtnText: 'back',
		/// <summary>
		/// A value that indicates the text of next button.
		/// Code example:
		/// $("#element").bwizard("option", "nextBtnText", "next Button");
		/// </summary>
		nextBtnText: 'next',
		/// <summary>
		/// The add event handler. A function called when a panel is added.
		/// Default: null.
		/// Type: Function.
		/// Code example: $("#element").bwizard({ add: function (e, ui) { } });
		/// </summary>
		///
		/// <param name="e" type="Object">jQuery.Event object.</param>
		/// <param name="ui" type="Object">
		/// The data that contains the related ui elements.
		/// ui.panel: The panel element.
		/// ui.index: The index of the panel.
		///</param>
		add: null,
		/// <summary>
		/// The remove event handler. A function called when a panel is removed.
		/// Default: null.
		/// Type: Function.
		/// Code example: $("#element").bwizard({ remove: function (e, ui) { } });
		/// </summary>
		///
		/// <param name="e" type="Object">jQuery.Event object.</param>
		/// <param name="ui" type="Object">
		/// The data that contains the related ui elements.
		/// ui.panel: The panel element.
		/// ui.index: The index of the panel.
		///</param>
		remove: null,
		/// <summary>
		/// The activeIndexChanged event handler.
		/// A function called when the activeIndex changed.
		/// Default: null.
		/// Type: Function.
		/// Code example:
		/// $("#element").bwizard({ activeIndexChanged: function (e, ui) { } });
		/// </summary>
		///
		/// <param name="e" type="Object">jQuery.Event object.</param>
		/// <param name="ui" type="Object">
		/// The data that contains the related ui elements.
		/// ui.panel: The panel element.
		/// ui.index: The index of the panel.
		///</param>
		activeIndexChanged: null,
		/// <summary>
		/// The show event handler. A function called when a panel is shown.
		/// Default: null.
		/// Type: Function.
		/// Code example: $("#element").bwizard({ show: function (e, ui) { } });
		/// </summary>
		///
		/// <param name="e" type="Object">jQuery.Event object.</param>
		/// <param name="ui" type="Object">
		/// The data that contains the related ui elements.
		/// ui.panel: The panel element.
		/// ui.index: The index of the panel.
		///</param>
		show: null,
		/// <summary>
		/// The load event handler.
		/// A function called after the content of a remote panel has been loaded.
		/// Default: null.
		/// Type: Function.
		/// Code example: $("#element").bwizard({ load: function (e, ui) { } });
		/// </summary>
		///
		/// <param name="e" type="Object">jQuery.Event object.</param>
		/// <param name="ui" type="Object">
		/// The data that contains the related ui elements.
		/// ui.panel: The panel element.
		/// ui.index: The index of the panel.
		///</param>
		load: null,
		/// <summary>
		/// The validating event handler.
		/// A function called before moving to next panel. Cancellable.
		/// Default: null.
		/// Type: Function.
		/// Code example:
		/// $("#element").bwizard({ validating: function (e, ui) { } });
		/// </summary>
		///
		/// <param name="e" type="Object">jQuery.Event object.</param>
		/// <param name="ui" type="Object">
		/// The data that contains the related ui elements.
		/// ui.panel: The panel element.
		/// ui.index: The index of the panel.
		/// ui.nextPanel: The next panel element.
		/// ui.nextIndex: The index of the next panel.
		///</param>
		validating: null
	},

	_defaults: {
		stepHeaderTemplate: '<li>#{title}</li>',
		panelTemplate: '<div></div>',
		spinner: '<em>Loading&#8230;</em>'
	},

	_create: function () {
		var self = this;
		self._pageLize(true);
	},

	_init: function () {
		var o = this.options,
			dis = o.disabled;
		if (o.disabledState) {
			this.disable();
			o.disabled = dis;
		} else {
			if (o.autoPlay) {
				this.play();
			}
		}
	},

	_setOption: function (key, value) {
		$.Widget.prototype._setOption.apply(this, arguments);

		switch (key) {
		case 'activeIndex':
			this.show(value);
			break;

		case 'navButtons':
			this._createButtons();
			break;

		default:
			this._pageLize();
			break;
		}
	},

	play: function () {
		/// <summary>Start displaying the panels in order automatically.</summary>
		var o = this.options, self = this, id;
		if (!this.element.data('intId.bwizard')) {
			id = window.setInterval(function () {
				var index = o.activeIndex + 1;
				if (index >= self.panels.length) {
					if (o.loop) {
						index = 0;
					} else {
						self.stop();
						return;
					}
				}
				self.show(index);
			}, o.delay);

			this.element.data('intId.bwizard', id);
		}
	},

	stop: function () {
		/// <summary>Stop automatic displaying.</summary>
		var id = this.element.data('intId.bwizard');
		if (id) {
			window.clearInterval(id);
			this.element.removeData('intId.bwizard');
		}
	},

	_normalizeBlindOption: function (o) {
		if (o.blind === undefined) {
			o.blind = false;
		}
		if (o.fade === undefined) {
			o.fade = false;
		}
		if (o.duration === undefined) {
			o.duration = 200;
		}
		if (typeof o.duration === 'string') {
			try {
				o.duration = parseInt(o.duration, 10);
			}
			catch (e) {
				o.duration = 200;
			}
		}
	},

	_createButtons: function () {
		var self = this, o = this.options, bt,
			addState, removeState,
			backBtnText = o.backBtnText,
			nextBtnText = o.nextBtnText;

		this._removeButtons();
		if (o.navButtons === 'none') {
			return;
		}

		if (!this.buttons) {
			bt = o.navButtons;

			this.buttons = $('<div/>');
			this.buttons.addClass('bwizard-buttons');

			this.backBtn =
				$("<a href='#'><i class='icon-chevron-left'></i> " +
					backBtnText + "</a>")
				.addClass('btn')
				.addClass('btn-large')
				.appendTo(this.buttons).bind({
					'click': function () {
						self.back();
						return false;
					}
				}).attr("role", "button");

			this.nextBtn =
				$("<a href='#'>" +
					nextBtnText + " <i class='icon-chevron-right icon-white'></i></a>")
				.addClass('btn')
				.addClass('btn-primary')
				.addClass('btn-large')
				.appendTo(this.buttons).bind({
					'click': function () {
						self.next();
						return false;
					}
				}).attr("role", "button");

			this.buttons.appendTo(this.element);
		}
	},

	_removeButtons: function () {
		if (this.buttons) {
			this.buttons.remove();
			this.buttons = undefined;
		}
	},

	_pageLize: function (init) {
		var self = this, o = this.options,
			fragmentId = /^#.+/; // Safari 2 reports '#' for an empty hash;

		//Fix a bug that when no title and has ul li element in its content
		//this.list = this.element.find('ol,ul').eq(0);
		var isOL = false;
		this.list = this.element.children('ol,ul').eq(0);
		if (this.list && this.list.length === 0) {
			this.list = null;
		}
		if (this.list) {
			if (this.list.get(0).tagName.toLowerCase() === "ol") {
				isOL = true;
			}
			this.lis = $('li', this.list);
			$('li', this.list).each(function(){
				$(this).find(".badge").remove();
				var i = $(this).index() + 1;
				$(this).contents().wrap('<span class="hidden-phone"/>');
				$(this).prepend('<span class="badge">' + i + '</span>');
				if (!isOL) {
					$(this).find('.badge').addClass('visible-phone');
				}
			});
		}

		if (init) {
			this.panels = $('> div', this.element);

			this.panels.each(function (i, p) {
				var url = $(p).attr('src');
				// inline
				if (url && !fragmentId.test(url)) {
					// mutable data
					$.data(p, 'load.bwizard', url.replace(/#.*$/, ''));
				}
			});

			this.element.addClass('bwizard clearfix');
			if (this.list) {
				this.list
					.addClass('bwizard-steps clearfix')
					.attr("role", "tablist")
					.attr("role", "tab");
			}
			this.container = $('<div/>');
			this.container.addClass('well');
			this.container.append(this.panels);
			this.container.appendTo(this.element);
			this.panels.attr("role", "tabpanel");

			// Activate a panel
			// use "activeIndex" option or try to retrieve:
			// 1. from cookie
			// 2. from actived class attribute on panel
			if (o.activeIndex === undefined) {
				if (typeof o.activeIndex !== 'number' && o.cookie) {
					o.activeIndex = parseInt(self._cookie(), 10);
				}
				if (typeof o.activeIndex !== 'number' &&
						this.panels.filter('.bwizard-activated').length) {
					o.activeIndex = this.panels
						.index(this.panels.filter('.bwizard-activated'));
				}
				o.activeIndex = o.activeIndex || (this.panels.length ? 0 : -1);
			} else if (o.activeIndex === null) {
				// usage of null is deprecated, TODO remove in next release
				o.activeIndex = -1;
			}

			// sanity check - default to first page...
			o.activeIndex = ((o.activeIndex >= 0 && this.panels[o.activeIndex]) ||
				o.activeIndex < 0) ? o.activeIndex : 0;

			this.panels.addClass('hide').attr('aria-hidden', true);
			if (o.activeIndex >= 0 && this.panels.length) {
				// check for length avoids error when initializing empty pages
				this.panels.eq(o.activeIndex).removeClass('hide')
					.addClass('bwizard-activated').attr('aria-hidden', false);
				this.load(o.activeIndex);
			}

			this._createButtons();
		} else {
			this.panels = $('> div', this.container);
			o.activeIndex = this.panels
				.index(this.panels.filter('.bwizard-activated'));
		}

		this._refreshStep();

		// set or update cookie after init and add/remove respectively
		if (o.cookie) {
			this._cookie(o.activeIndex, o.cookie);
		}

		// reset cache if switching from cached to not cached
		if (o.cache === false) {
			this.panels.removeData('cache.bwizard');
		}

		if (o.showOption === undefined || o.showOption === null) {
			o.showOption = {};
		}
		this._normalizeBlindOption(o.showOption);

		if (o.hideOption === undefined || o.hideOption === null) {
			o.hideOption = {};
		}
		this._normalizeBlindOption(o.hideOption);

		// remove all handlers
		this.panels.unbind('.bwizard');
	},

	_refreshStep: function () {
		var o = this.options;

		if (this.lis) {
			this.lis.removeClass('current').attr('aria-selected', false).find('.badge').removeClass('badge-inverse');;
			if (o.activeIndex >= 0 && o.activeIndex <= this.lis.length - 1) {
				if (this.lis) {
					this.lis.eq(o.activeIndex).addClass('current').attr('aria-selected', true).find('.badge').addClass('badge-inverse');
				}
			}
		}

		if (this.buttons && !o.loop) {
			this.backBtn[o.activeIndex <= 0 ? 'addClass' :
				'removeClass']('disabled')
				.attr('aria-disabled', o.activeIndex === 0);
			this.nextBtn[o.activeIndex >= this.panels.length - 1 ?
				'addClass' : 'removeClass']('disabled')
				.attr('aria-disabled', (o.activeIndex >= this.panels.length - 1));
		}
	},

	_sanitizeSelector: function (hash) {
		// we need this because an id may contain a ":"
		return hash.replace(/:/g, '\\:');
	},

	_cookie: function () {
		var cookie = this.cookie || (this.cookie = this.options.cookie.name);
		return $.cookie.apply(null, [cookie].concat($.makeArray(arguments)));
	},

	_ui: function (panel) {
		return {
			panel: panel,
			index: this.panels.index(panel)
		};
	},

	_removeSpinner: function () {
		// restore all former loading bwizard labels
		var spinner = this.element.data('spinner.bwizard');
		if (spinner) {
			this.element.removeData('spinner.bwizard');
			spinner.remove();
		}
	},

	// Reset certain styles left over from animation
	// and prevent IE's ClearType bug...
	_resetStyle: function ($el) {
		$el.css({ display: '' });
		if (!$.support.opacity) {
			$el[0].style.removeAttribute('filter');
		}
	},

	destroy: function () {
		var o = this.options;
		this.abort();
		this.stop();
		this._removeButtons();
		this.element.unbind('.bwizard')
			.removeClass([
				'bwizard',
				'clearfix'
			].join(' '))
			.removeData('bwizard');

		if (this.list) {
			this.list.removeClass('bwizard-steps clearfix')
				.removeAttr('role');
		}

		if (this.lis) {
			this.lis.removeClass('current').removeAttr('role');
			this.lis.each(function () {
				if ($.data(this, 'destroy.bwizard')) {
					$(this).remove();
				} else {
					$(this).removeAttr('aria-selected');
				}
			});
		}

		this.panels.each(function () {
			var $this = $(this).unbind('.bwizard');
			$.each(['load', 'cache'], function (i, prefix) {
				$this.removeData(prefix + '.bwizard');
			});

			if ($.data(this, 'destroy.bwizard')) {
				$(this).remove();
			} else {
				$(this).removeClass([
					'bwizard-activated',
					'hide'
				].join(' ')).css({ position: '', left: '', top: '' })
				.removeAttr('aria-hidden');
			}
		});

		this.container.replaceWith(this.container.contents());

		if (o.cookie) {
			this._cookie(null, o.cookie);
		}

		return this;
	},

	add: function (index, title) {
		/// <summary>Add a new panel.</summary>
		/// <param name="index" type="Number">
		/// Zero-based position where to insert the new panel.
		/// </param>
		/// <param name="title" type="String">The step title.</param>
		if (index === undefined) {
			index = this.panels.length; // append by default
		}

		if (title === undefined) {
			title = "Step " + index;
		}

		var self = this, o = this.options,
			 $panel = $(o.panelTemplate || self._defaults.panelTemplate)
				.data('destroy.bwizard', true),
			$li;
		$panel.addClass('hide')
			.attr('aria-hidden', true);

		if (index >= this.panels.length) {
			if (this.panels.length > 0) {
				$panel.insertAfter(this.panels[this.panels.length - 1]);
			} else {
				$panel.appendTo(this.container);
			}
		} else {
			$panel.insertBefore(this.panels[index]);
		}

		if (this.list && this.lis) {
			$li = $((o.stepHeaderTemplate || self._defaults.stepHeaderTemplate)
				.replace(/#\{title\}/g, title));
			$li.addClass('ui-widget-header ui-corner-all ui-priority-secondary')
				.data('destroy.bwizard', true);

			if (index >= this.lis.length) {
				$li.appendTo(this.list);
			} else {
				$li.insertBefore(this.lis[index]);
			}
		}

		this._pageLize();

		if (this.panels.length === 1) { // after pagelize
			o.activeIndex = 0;
			$li.addClass('ui-priority-primary');
			$panel.removeClass('hide')
				.addClass('bwizard-activated')
				.attr('aria-hidden', false);
			this.element.queue("bwizard", function () {
				self._trigger('show', null, self._ui(self.panels[0]));
			});

			this._refreshStep();
			this.load(0);
		}

		// callback
		this._trigger('add', null, this._ui(this.panels[index]));
		return this;
	},

	remove: function (index) {
		/// <summary>Remove a panel.</summary>
		/// <param name="index" type="Number">
		/// The zero-based index of the panel to be removed.
		/// </param>
		var o = this.options,
			//$li = this.lis.eq(index).remove(),
			$panel = this.panels.eq(index).remove();

		this.lis.eq(index).remove();
		if (index < o.activeIndex) {
			o.activeIndex--;
		}

		this._pageLize();

		//Ajust the active panel index in some case
		if ($panel.hasClass('bwizard-activated') && this.panels.length >= 1) {
			this.show(index + (index < this.panels.length ? 0 : -1));
		}

		// callback
		this._trigger('remove', null, this._ui($panel[0]));
		return this;
	},

	_showPanel: function (p) {
		var self = this, o = this.options, $show = $(p), props;
		$show.addClass('bwizard-activated');
		if ((o.showOption.blind || o.showOption.fade) && o.showOption.duration > 0) {
			props = { duration: o.showOption.duration };
			if (o.showOption.blind) {
				props.height = 'toggle';
			}
			if (o.showOption.fade) {
				props.opacity = 'toggle';
			}
			$show.hide().removeClass('hide') // avoid flicker that way
				.animate(props, o.showOption.duration || 'normal', function () {
					self._resetStyle($show);
					self._trigger('show', null, self._ui($show[0]));
					self._removeSpinner();
					$show.attr('aria-hidden', false);
					self._trigger('activeIndexChanged', null, self._ui($show[0]));
				});
		} else {
			$show.removeClass('hide').attr('aria-hidden', false);
			self._trigger('show', null, self._ui($show[0]));
			self._removeSpinner();
			self._trigger('activeIndexChanged', null, self._ui($show[0]));
		}
	},

	_hidePanel: function (p) {
		var self = this, o = this.options, $hide = $(p), props;
		$hide.removeClass('bwizard-activated');
		if ((o.hideOption.blind || o.hideOption.fade) && o.hideOption.duration > 0) {
			props = { duration: o.hideOption.duration };
			if (o.hideOption.blind) {
				props.height = 'toggle';
			}
			if (o.hideOption.fade) {
				props.opacity = 'toggle';
			}
			$hide.animate(props, o.hideOption.duration || 'normal', function () {
				$hide.addClass('hide').attr('aria-hidden', true);
				self._resetStyle($hide);
				self.element.dequeue("bwizard");
			});
		} else {
			$hide.addClass('hide').attr('aria-hidden', true);
			this.element.dequeue("bwizard");
		}
	},

	show: function (index) {
		/// <summary>Active and display the panel at specified position.</summary>
		/// <param name="index" type="Number">
		/// The zero-based index of the panel to be actived.
		/// </param>
		if (index < 0 || index >= this.panels.length) {
			return this;
		}

		// previous animation is still processing
		if (this.element.queue("bwizard").length > 0) {
			return this;
		}

		var self = this, o = this.options,
			args = $.extend({}, this._ui(this.panels[o.activeIndex])),
			$hide, $show;
		args.nextIndex = index;
		args.nextPanel = this.panels[index];
		if (this._trigger('validating', null, args) === false) {
			return this;
		}

		$hide = this.panels.filter(':not(.hide)');
		$show = this.panels.eq(index);
		o.activeIndex = index;

		this.abort();

		if (o.cookie) {
			this._cookie(o.activeIndex, o.cookie);
		}

		this._refreshStep();
		// show new panel
		if ($show.length) {
			if ($hide.length) {
				this.element.queue("bwizard", function () {
					self._hidePanel($hide);
				});
			}

			this.element.queue("bwizard", function () {
				self._showPanel($show);
			});

			this.load(index);
		}
		else {
			throw 'Bootstrap Wizard: Mismatching fragment identifier.';
		}

		return this;
	},

	next: function () {
		/// <summary>Moves to the next panel.</summary>
		var o = this.options,
			index = o.activeIndex + 1;
		if (o.disabled) {
			return false;
		}
		if (o.loop) {
			index = index % this.panels.length;
		}

		if (index < this.panels.length) {
			this.show(index);
			return true;
		}
		return false;
	},

	back: function () {
		/// <summary>Moves to the previous panel.</summary>
		var o = this.options,
			index = o.activeIndex - 1;
		if (o.disabled) {
			return false;
		}
		if (o.loop) {
			index = index < 0 ? this.panels.length - 1 : index;
		}

		if (index >= 0) {
			this.show(index);
			return true;
		}
		return false;
	},

	load: function (index) {
		/// <summary>Reload the content of an Ajax panel programmatically.</summary>
		/// <param name="index" type="Number">
		/// The zero-based index of the panel to be loaded
		/// </param>
		var self = this,
			o = this.options,
			p = this.panels.eq(index)[0],
			url = $.data(p, 'load.bwizard'),
			spinner;

		this.abort();

		// not remote or from cache
		if (!url || this.element.queue("bwizard").length !== 0 &&
				$.data(p, 'cache.bwizard')) {
			this.element.dequeue("bwizard");
			return;
		}

		// load remote from here on
		if (o.spinner) {
			spinner = this.element.data('spinner.bwizard');
			if (!spinner) {
				spinner = $('<div class="modal" id="spinner" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"/>');
				spinner.html(o.spinner || self._defaults.spinner);
				spinner.appendTo(document.body);
				this.element.data('spinner.bwizard', spinner);
				spinner.modal();
			}
		}

		this.xhr = $.ajax($.extend({}, o.ajaxOptions, {
			url: url,
			dataType: 'html',
			success: function (r, s) {
				$(p).html(r);

				if (o.cache) {
					// if loaded once do not load them again
					$.data(p, 'cache.bwizard', true);
				}

				// callbacks
				self._trigger('load', null, self._ui(self.panels[index]));
				try {
					if (o.ajaxOptions && o.ajaxOptions.success) {
						o.ajaxOptions.success(r, s);
					}
				}
				catch (e1) { }
			},
			error: function (xhr, s, e) {
				// callbacks
				self._trigger('load', null, self._ui(self.panels[index]));
				try {
					// Passing index avoid a race condition when this method is
					// called after the user has selected another panel.
					if (o.ajaxOptions && o.ajaxOptions.error) {
						o.ajaxOptions.error(xhr, s, index, p);
					}
				}
				catch (e2) { }
			}
		}));

		// last, so that load event is fired before show...
		self.element.dequeue("bwizard");

		return this;
	},

	abort: function () {
		/// <summary>
		/// Terminate all running panel ajax requests and animations.
		/// </summary>
		this.element.queue([]);
		this.panels.stop(false, true);

		// "bwizard" queue must not contain more than two elements,
		// which are the callbacks for hide and show
		this.element.queue("bwizard",
			this.element.queue("bwizard").splice(-2, 2));

		// terminate pending requests from other bwizard
		if (this.xhr) {
			this.xhr.abort();
			delete this.xhr;
		}

		// take care of spinners
		this._removeSpinner();
		return this;
	},

	url: function (index, url) {
		/// <summary>
		/// Change the url from which an Ajax (remote) panel will be loaded.
		/// </summary>
		/// <param name="index" type="Number">
		/// The zero-based index of the panel of which its URL is to be updated.
		/// </param>
		/// <param name="url" type="String">
		/// A URL the content of the panel is loaded from.
		/// </param>
		this.panels.eq(index).removeData('cache.bwizard')
			.data('load.bwizard', url);
		return this;
	},

	count: function () {
		/// <summary>Retrieve the number panels.</summary>
		return this.panels.length;
	}

});
} (jQuery));
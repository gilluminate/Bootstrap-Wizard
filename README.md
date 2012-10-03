[Bootstrap Wizard](https://github.com/gilluminate/Bootstrap-Wizard)
================

Uses [Bootstrap](http://getbootstrap.com/) and [JQuery](https://github.com/jquery/jquery) to provide a highly customizable and powerful Wizard UI to your project. A wizard is used to display sections of content on separate, navigable pages so you can save screen real estate or simplify input tasks by creating a series of forms.

Compatible IE7+, FF, Chrome, Safari

Credits
-------
Modified from [Wijmo](https://github.com/wijmo/Wijmo-Complete) under GPLv3 to accomodate Bootstrap styles and functionality instead of JQueryUI and Wijmo Complete.

Adapted [CSS](https://github.com/twitter/bootstrap/issues/1982#issuecomment-7814657) from [@wotaewer](https://github.com/wotaewer) for the tabs.

Utilizes [jquery.cookie.js](https://github.com/carhartl/jquery-cookie) and [jquery.ui.widget.js](https://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.widget.js) which are both included in this project.

Open Source License
-------
Bootstrap Wizard is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

Bootstrap Wizard is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with Bootstrap Wizard.  If not, see <http://www.gnu.org/licenses/>.

Requirements
------------
[Bootstrap](http://getbootstrap.com/) v2.0+<br>(If custom build is used, you will want to include badges, buttons, well, and modal)

[JQuery](http://jquery.com/) v1.4+

Usage
-----
Include the following to your page:

```
<script src="Bootstrap_Wizard/js/bwizard.min.js"></script>
<link rel="stylesheet" href="Bootstrap_Wizard/css/bwizard.min.css">
```


Full Markup and Scripting
-------------------------

The markup used to create a Bootstrap Wizard instance should resemble one of the following:

Pages only: 
```
<div>
	<div></div>
	<div></div>
</div>
```

Pages with titles:
```
<div>
	<ol>
		<li>This is the first step.</li>
		<li>This is the second step.</li>
	</ol>
	<div></div>
	<div></div>
</div>
```
```Note:``` If Bootstrap Responsive is being used, Badges will automatically turn on in the tabs and text will be hidden for phone sizes. To force badges to appear on all sizes, use OL instead of UL.

You can initialize the widget with the following jQuery script:
```
<script>
	$(document).ready(function () {
		$("#wizard").bwizard();
	});
</script>
```

Options
-------

**ajaxOptions**
* A value that indicates additional Ajax options to consider when loading panel content (see $.ajax). Please see following link for more details: [api.jquery.com/jQuery.ajax/](http://api.jquery.com/jQuery.ajax/)
* The spinner option is used while content is loading (see below).
* Type: Options
* Default: null

**autoPlay**
* The autoPlay option allows the panels to automatically display in order.
* Type: Boolean
* Default: false
* Code example: ```$("#wizard").bwizard({autoPlay: true});```

**backBtnText**
* The backBtnText option defines the text for the wizard back button.
* Type: Function
* Default: 'back'
* Code example: ```$("#wizard").bwizard({backBtnText: "Back Button"});```

**cache**
* An option that determines whether to cache remote wijwizard content. Cached content is being lazy loaded, for example once and only once for the panel is displayed.  Note that to prevent the actual Ajax requests from being cached by the browser, you need to provide an extra cache: false flag to ajaxOptions.
* Type: Boolean
* Default: false
* Code example: ```$("#wizard").bwizard({cache: false});```

**cookie**
* The cookie option is a value that stores the latest active index in a cookie. The cookie is then used to determine the initially active index if the activedIndex option is not defined. This option requires a cookie plugin. The object needs to have key/value pairs of the form the cookie plugin expects as options. For example: { expires: 7, path: '/', domain: 'jquery.com', secure: true }
* Type: {}
* Default: null 
* Code example: ```$("#wizard").bwizard({cookie:{expires: 7, path: '/', domain:  'jquery.com', secure: true }})```

**delay**
* The delay option determines the time span between displaying panels in autoplay mode.
* Type: number
* Default: 3000
* Code example: ```$("#wizard").delay({delay: 3000});```

**hideOption**
* The hideOption option defines the animation effects when hiding the panel content. For example, {blind: true, fade: true, duration: 200}.
* Type: hash
* Default: {fade: true}
* Code example: ```$("#wizard").bwizard({hideOption:{fade: true}});```

**loop**
* The loop option allows the wizard to begin again from the first panel when reaching the last panel in autoPlay mode.
* Type: Boolean
* Default: false
* Code example: ```$("#wizard").bwizard({loop: false});```

**nextBtnText**
* The nextBtnText option defines the text for the wizard next button.
* Type: Function
* Default: 'next'
* Code example: ```$("#wizard").bwizard({nextBtnText: "next Button"});```

**panelTemplate**
* The panelTemplate option is an HTML template from which a new panel is created. The new panel is created by adding a panel with the add method or when creating a panel from a remote panel on the fly.
* Type: String
* Default: ```‘<div></div>’```
* Code example: ```$("#wizard").bwizard({panelTemplate: ’<div class="myPanelClass"></div>’});```

**showOption**
* The showOption option defines the animation effects when hiding the panel content. For example, { blind: true, fade: true, duration: 200}.
* Type: hash
* Default: {fade: true, duration: 400}
* Code example: ```$("#wizard").bwizard({showOption{fade: true, duration: 400}});```

**spinner**
* **Requires Bootstrap Modal**
* The HTML content of this string is shown in a panel while remote content is loading.  Pass the option in an empty string to deactivate that behavior. 
* Type: String
* Default: ```'<em>Loading&#8230;</em>'```
* Code example: ```$("#wizard").bwizard({spinner: '<img src="spinner.gif">'});	```

**stepHeaderTemplate**
* The stepHeaderTemplate option creates an HTML template for the step header when a new panel is added with the add method or when creating a panel for a remote panel on the fly.
* Type: String
* Default: ```<li>#{title}</li>```
* Code example: ```$("#wizard").bwizard({stepHeaderTemplate:’<li><em>#{title}</em></li>’});```

Events
------
The following events are available with the wizard:

**activeIndexChanged**
* The activeIndexChanged event handler is a function called when the activeIndex is changed.
* Default: null
* Type: Function
* _Parameters_:
	* :e - Type is "Object". jQuery.Event object.
	* :ui - Type is "Object". The data that contains the related UI elements.
* Code example: ```$("#element").bwizard({ activeIndexChanged: function (e, ui) { } });```

**add**
* The add event handler is a function called when a panel is added.
* Default: null
* Type: Function
* _Parameters_:
	* :e - Type is "Object". jQuery.Event object.
	* :ui - Type is "Object". The data that contains the related UI elements.
	* ::ui.panel: The panel element.
	* ::ui.index: The index of the panel.
* Code example: ```$("#element").bwizard({ remove: function (e, ui) { } });```

**load**
* The load event handler is a function called after the content of a remote panel has been loaded.
* Default: null
* Type: Function
* _Parameters_:
	* :e - Type is "Object". jQuery.Event object.
	* :ui - Type is "Object". The data that contains the related UI elements.
	* ::ui.panel: The panel element.
	* ::ui.index: The index of the panel.
* Code example: ```$("#element").bwizard({ validating: function (e, ui) { } });```

**remove**
* The remove event handler is a function called when a panel is removed.
* Default: null
* Type: Function
* _Parameters_:
	* :e - Type is "Object". jQuery.Event object.
	* :ui - Type is "Object". The data that contains the related UI elements.
	* ::ui.panel: The panel element.
	* ::ui.index: The index of the panel.
* Code example: ```$("#element").bwizard({ remove: function (e, ui) { } });```
			
**show**
* The show event handler is a function called when a panel is shown.
* Default: null
* Type: Function
* _Parameters_:
	* :e - Type is "Object". jQuery.Event object.
	* :ui - Type is "Object". The data that contains the related UI elements.
	* ::ui.panel: The panel element.
	* ::ui.index: The index of the panel.
* Code example: ```$("#element").bwizard({ show: function (e, ui) { } });```

**validating**
* The validating event handler is a function called before moving to the next panel. This event is cancelable.
* Default: null
* Type: Function
* _Parameters_:
	* :e - Type is "Object". jQuery.Event object.
	* :ui - Type is "Object". The data that contains the related UI elements.
	* ::ui.panel: The panel element.
	* ::ui.index: The index of the panel.
* Code example: ```$("#element").bwizard({ show: function (e, ui) { } });```

Methods
-------
The following methods are available with the wizard:

**abort**
* The abort() method terminates all running panel Ajax requests and animations.

**add**
The add() method adds a new panel.
* _Parameters_: 
	* :index(number) - Zero-based position where to insert the new panel.
	* :title (string) – The step title.
	* :desc(string) - The step description.

**back**
The back() method moves to the previous panel.

**count**
The count() method retrieves the number of panels.

**load**
* The load() method reloads the content of an Ajax panel programmatically.
* _Parameters_: 
	* :index(number) - The zero-based index of the panel to be loaded.

**next**
* The next() method moves to the next panel.

**play**
* The play() method begins displaying the panels in order automatically.

**remove**
* The remove() method removes a panel.
* _Parameters_:
	* :index(number) - The zero-based index of the panel to be removed.

**show**
* The show() method selects an active panel and displays the panel at a specified position.
* _Parameters_: 
	* :index(number) - The zero-based index of the panel to be selected.

**stop**
* The stop() method stops displaying the panels in order automatically.

**url**
* The url() method changes the URL from which an Ajax (remote) panel will be loaded.
* _Parameters_: 
	* :Index (number) - The zero-based index of the panel of which its URL is to be updated.
	* :URL (string) - A URL the content of the panel is loaded from.
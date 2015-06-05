{%

////////////////////////////////////////////////////////////////
// Non-skeleton, full-fat demo code
////////////////////////////////////////////////////////////////
  if (!skeleton) {

%}
/**
 * A module defining `{%= viewName %}`.
 *
 * @module nmodule/{%= name %}/rc/{%= viewName %}
 */
define(['bajaux/Widget',
        'bajaux/mixin/subscriberMixIn',
        'jquery',
        'hbs!nmodule/{%= name %}/rc/template/{%= viewName %}-structure',
        'hbs!nmodule/{%= name %}/rc/template/{%= viewName %}-content',
        'css!nmodule/{%= name %}/rc/{%= viewName %}'], function (
        Widget,
        subscriberMixin,
        $,
        tpl{%= viewName %}Structure,
        tpl{%= viewName %}Content) {

  'use strict';

  var SELECTED_CLASS = 'active',
      BUTTON_CLASS = '{%= viewName %}-button';

  /**
   * A demonstration Widget. This builds a list of buttons from the slots of a
   * Complex value, allowing the user to select a slot.
   *
   * @class
   * @extends module:bajaux/Widget
   * @alias module:nmodule/{%= name %}/rc/{%= viewName %}
   */
  var {%= viewName %} = function {%= viewName %}() {
    /** remember to call super constructor. Javascript won't do this for you */
    Widget.apply(this, arguments);
    subscriberMixin(this);
  };

  //extend and set up prototype chain
  {%= viewName %}.prototype = Object.create(Widget.prototype);
  {%= viewName %}.prototype.constructor = {%= viewName %};

  /**
   * Do initial setup of the DOM for the view. This will set up the DOM's
   * structure and create a space where the buttons will go.
   *
   * @param {jQuery} element the DOM element into which to load this View
   */
  {%= viewName %}.prototype.doInitialize = function (dom) {
    var that = this;

    dom.html(tpl{%= viewName %}Structure({
      titleText: "These are the slots on your component.",
      selectedSlotText: "You've selected slot: "
    }));

    dom.delegate('.{%= viewName %}-content button', 'click', function () {
      var $this = $(this);
      $this.siblings().removeClass(SELECTED_CLASS);
      $this.addClass(SELECTED_CLASS);
      that.$updateSlotText();
    });
  };

  /**
   * Reads the currently selected slot and update the display accordingly.
   * The display will be updated asynchronously.
   *
   * @private
   */
  {%= viewName %}.prototype.$updateSlotText = function () {
    var that = this,
        dom = that.jq();

    that.read().done(function (slotName) {
      dom.find('.{%= viewName %}-selected-slot').text(slotName);
    });
  };

  /**
   * Builds the actual buttons and loads them into the View.
   *
   * @private
   * @param {baja.Complex} value the value being loaded in
   */
  {%= viewName %}.prototype.$buildButtons = function (value) {
    var that = this,
        dom = that.jq(),
        contentDom = dom.find('.{%= viewName %}-content'),
        buttons = [];

    value.getSlots().each(function (slot) {
      buttons.push({
        name: slot.getName(),
        displayName: value.getDisplayName(slot)
      });
    });

    contentDom.html(tpl{%= viewName %}Content({
      buttons: buttons
    }));

    that.$updateSlotText();
  };

  /**
   * Loads in a Complex value and builds up an array of buttons, one for each
   * slot.
   *
   * @param {baja.Complex} value the complex value whose slots you wish to
   * select from
   */
  {%= viewName %}.prototype.doLoad = function (value) {
    var that = this;

    that.$buildButtons(value);

    that.getSubscriber().attach('added removed renamed', function () {
      that.$buildButtons(value);
    });
  };

  /**
   * Gets the currently selected slot
   *
   * @returns {jQuery.Promise} to be resolved with the name of the currently
   * selected slot
   */
  {%= viewName %}.prototype.doRead = function () {
    var df = $.Deferred(),
        selectedButton = this.jq().find(
          '.{%= viewName %}-content .' + BUTTON_CLASS + '.' + SELECTED_CLASS);

    return df.resolve(selectedButton.data('slot')).promise();
  };

  return {%= viewName %};
});
{%


////////////////////////////////////////////////////////////////
// Pared-down skeleton code
////////////////////////////////////////////////////////////////
} else {



%}
/**
 * A module defining `{%= viewName %}`.
 *
 * @module nmodule/{%= name %}/rc/{%= viewName %}
 */
define(['bajaux/Widget', 'jquery'], function (Widget, $) {

  'use strict';

  /**
   * Description of your widget.
   *
   * @class
   * @extends module:bajaux/Widget
   * @alias module:nmodule/{%= name %}/rc/{%= viewName %}
   */
  var {%= viewName %} = function {%= viewName %}() {
    Widget.apply(this, arguments);
  };

  //extend and set up prototype chain
  {%= viewName %}.prototype = Object.create(Widget.prototype);
  {%= viewName %}.prototype.constructor = {%= viewName %};

  /**
   * Describe how your view does its initial setup of the DOM.
   *
   * @param {jQuery} element the DOM element into which to load this View
   */
  {%= viewName %}.prototype.doInitialize = function (dom) {
    dom.html('<input type="text" value="value goes here" />');
  };

  /**
   * Describe how your view loads in a value.
   *
   * @param value description of the value to be loaded into this view
   */
  {%= viewName %}.prototype.doLoad = function (value) {
    this.jq().find('input').val(String(value));
  };

  /**
   * Describe what kind of data you can read out of this view.
   *
   * @returns {jQuery.Promise} to be resolved with the current value
   */
  {%= viewName %}.prototype.doRead = function () {
    var val = this.jq().find('input').val();
    return $.Deferred().resolve(val).promise();
  };

  return {%= viewName %};
});
{% } %}
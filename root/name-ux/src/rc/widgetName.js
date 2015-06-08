{%

////////////////////////////////////////////////////////////////
// Non-skeleton, full-fat demo code
////////////////////////////////////////////////////////////////
  if (!skeleton) {

%}
/**
 * A module defining `{%= widgetName %}`.
 *
 * @module nmodule/{%= name %}/rc/{%= widgetName %}
 */
define(['bajaux/Widget',
        'bajaux/mixin/subscriberMixIn',
        'jquery',
        'Promise',
        'hbs!nmodule/{%= name %}/rc/template/{%= widgetName %}-structure',
        'hbs!nmodule/{%= name %}/rc/template/{%= widgetName %}-content',
        'css!nmodule/{%= name %}/rc/{%= widgetName %}'], function (
        Widget,
        subscriberMixin,
        $,
        Promise,
        tpl{%= widgetName %}Structure,
        tpl{%= widgetName %}Content) {

  'use strict';

  var SELECTED_CLASS = 'active',
      BUTTON_CLASS = '{%= widgetName %}-button';

  /**
   * A demonstration Widget. This builds a list of buttons from the slots of a
   * Complex value, allowing the user to select a slot.
   *
   * @class
   * @extends module:bajaux/Widget
   * @alias module:nmodule/{%= name %}/rc/{%= widgetName %}
   */
  var {%= widgetName %} = function {%= widgetName %}() {
    /** remember to call super constructor. Javascript won't do this for you */
    Widget.apply(this, arguments);
    subscriberMixin(this);
  };

  //extend and set up prototype chain
  {%= widgetName %}.prototype = Object.create(Widget.prototype);
  {%= widgetName %}.prototype.constructor = {%= widgetName %};

  /**
   * Do initial setup of the DOM for the widget. This will set up the DOM's
   * structure and create a space where the buttons will go.
   *
   * @param {jQuery} element the DOM element into which to load this widget
   */
  {%= widgetName %}.prototype.doInitialize = function (dom) {
    var that = this;

    dom.html(tpl{%= widgetName %}Structure({
      titleText: "These are the slots on your component.",
      selectedSlotText: "You've selected slot: "
    }));

    dom.on('click', '.{%= widgetName %}-content button', function () {
      var $this = $(this);
      $this.siblings().removeClass(SELECTED_CLASS);
      $this.addClass(SELECTED_CLASS);
      that.$updateSlotText();
      that.setModified(true);
    });
  };

  /**
   * Reads the currently selected slot and update the display accordingly.
   * The display will be updated asynchronously.
   *
   * @private
   */
  {%= widgetName %}.prototype.$updateSlotText = function () {
    var that = this,
        dom = that.jq();

    that.read().done(function (slotName) {
      dom.find('.{%= widgetName %}-selected-slot').text(slotName);
    });
  };

  /**
   * Builds the actual buttons and loads them into the widget.
   *
   * @private
   * @param {baja.Complex} value the value being loaded in
   */
  {%= widgetName %}.prototype.$buildButtons = function (value) {
    var that = this,
        dom = that.jq(),
        contentDom = dom.find('.{%= widgetName %}-content'),
        buttons = [];

    value.getSlots().each(function (slot) {
      buttons.push({
        name: slot.getName(),
        displayName: value.getDisplayName(slot)
      });
    });

    contentDom.html(tpl{%= widgetName %}Content({
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
  {%= widgetName %}.prototype.doLoad = function (value) {
    var that = this;

    that.$buildButtons(value);

    that.getSubscriber().attach('added removed renamed', function () {
      that.$buildButtons(value);
    });
  };

  /**
   * Gets the currently selected slot
   *
   * @returns {Promise} promise to be resolved with the name of the currently
   * selected slot
   */
  {%= widgetName %}.prototype.doRead = function () {
    var selectedButton = this.jq().find(
          '.{%= widgetName %}-content .' + BUTTON_CLASS + '.' + SELECTED_CLASS);

    //promises are optional - the slot could also be returned directly
    return Promise.resolve(selectedButton.data('slot'));
  };

  return {%= widgetName %};
});
{%


////////////////////////////////////////////////////////////////
// Pared-down skeleton code
////////////////////////////////////////////////////////////////
} else {



%}
/**
 * A module defining `{%= widgetName %}`.
 *
 * @module nmodule/{%= name %}/rc/{%= widgetName %}
 */
define(['bajaux/Widget', 'jquery', 'Promise'], function (Widget, $, Promise) {

  'use strict';

  /**
   * Description of your widget.
   *
   * @class
   * @extends module:bajaux/Widget
   * @alias module:nmodule/{%= name %}/rc/{%= widgetName %}
   */
  var {%= widgetName %} = function {%= widgetName %}() {
    Widget.apply(this, arguments);
  };

  //extend and set up prototype chain
  {%= widgetName %}.prototype = Object.create(Widget.prototype);
  {%= widgetName %}.prototype.constructor = {%= widgetName %};

  /**
   * Describe how your widget does its initial setup of the DOM.
   *
   * @param {jQuery} element the DOM element into which to load this widget
   */
  {%= widgetName %}.prototype.doInitialize = function (dom) {
    dom.html('<input type="text" value="value goes here" />');
  };

  /**
   * Describe how your widget loads in a value.
   *
   * @param value description of the value to be loaded into this widget
   */
  {%= widgetName %}.prototype.doLoad = function (value) {
    this.jq().find('input').val(String(value));
  };

  /**
   * Describe what kind of data you can read out of this widget.
   *
   * @returns {Promise} promise to be resolved with the current value
   */
  {%= widgetName %}.prototype.doRead = function () {
    return Promise.resolve(this.jq().find('input').val());
  };

  return {%= widgetName %};
});
{% } %}
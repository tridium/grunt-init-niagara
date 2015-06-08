{%

////////////////////////////////////////////////////////////////
// Non-skeleton, full-fat demo code
////////////////////////////////////////////////////////////////
  if (!skeleton) {

%}
define(['baja!',
        'jquery',
        'Promise',
        'nmodule/{%= name %}/rc/{%= widgetName %}',
        'nmodule/js/rc/jasmine/promiseUtils'], function (
        baja,
        $,
        Promise,
        {%= widgetName %},
        promiseUtils) {

  'use strict';

  var doPromise = promiseUtils.doPromise,
      addCustomMatchers = promiseUtils.addCustomMatchers;

  describe('nmodule/{%= name %}/rc/{%= widgetName %}', function () {
    var stooges,
        widget,
        elem;
        
    function addStoogesComponent() {
      return baja.Ord.make('station:|slot:').get({ lease: true })
        .then(function (station) {
          return station.add({
            slot: 'stooges',
            value: baja.$('baja:Component', {
              moe: true, larry: true, curly: true
            })
          });
        })
        .then(function () {
          return baja.Ord.make('station:|slot:/stooges').get({ lease: true });
        })
        .then(function (s) {
          stooges = s;
        });
    }
    
    function removeStoogesComponent() {
      return baja.Ord.make('station:|slot:').get({ lease: true })
        .then(function (station) {
          return station.remove({ slot: 'stooges' });
        });
    }
    
    function initializeWidget() {
      widget = new {%= widgetName %}();
      elem = $('<div/>');

      return widget.initialize(elem);
    }

    beforeEach(function () {
      //for each spec, we want an initialized widget, and a mounted
      //component to work with.
      //doPromise wraps the promise execution in jasmine runs/waitsFor calls
      //to ensure it completes before continuing with the test.
      doPromise(Promise.join(
        addStoogesComponent(),
        initializeWidget()
      ));
 
      //addCustomMatchers gets us the toBeResolvedWith() matcher along with
      //some others. see the JSDoc for js/rc/jasmine/promiseUtils for details.
      addCustomMatchers(this);
    });
    
    afterEach(function () {
      //after each spec, we clean up after ourselves.
      doPromise(removeStoogesComponent());
    });

    describe('#doInitialize()', function () {
      it('creates the structure to load buttons into', function () {
        expect(elem.find('.{%= widgetName %}-header').length).toBe(1);
        expect(elem.find('.{%= widgetName %}-content').length).toBe(1);
      });

      it('arms a handler to set active class on button click', function () {
        var contentDom = elem.find('.{%= widgetName %}-content'),
            button = $('<button></button>');

        button.appendTo(contentDom).click();
        expect(button).toHaveClass('active');
      });

      it("removes active class from other buttons when one is clicked", function () {
        var contentDom = elem.find('.{%= widgetName %}-content'),
            button1 = $('<button></button>').appendTo(contentDom),
            button2 = $('<button></button>').appendTo(contentDom),
            button3 = $('<button></button>').appendTo(contentDom);

        button1.click();
        expect(button1).toHaveClass('active');

        button2.click();
        expect(button1).not.toHaveClass('active');
        expect(button2).toHaveClass('active');

        button3.click();
        expect(button3).toHaveClass('active');
        expect(contentDom.find('button.active').length).toBe(1);
      });

      it('arms a handler to display selected slot name', function () {
        var slotDom = elem.find('.{%= widgetName %}-selected-slot');

        runs(function () {
          var contentDom = elem.find('.{%= widgetName %}-content'),
              button = $('<button class="{%= widgetName %}-button" data-slot="curlyJoe"></button>');

          button.appendTo(contentDom);
          button.click();
        });

        waitsFor(function () {
          return slotDom.text();
        }, 100, 'slot name to be displayed');

        runs(function () {
          expect(slotDom.text()).toBe('curlyJoe');
        });
      });
    });

    describe('#doLoad()', function () {
      beforeEach(function () {
        doPromise(widget.load(stooges));
      });

      it('creates a button for each slot', function () {
        var slots = stooges.getSlots().toArray(),
            buttons = elem.find('button');

        expect(buttons.length).toBe(slots.length);
        buttons.each(function (i, elem) {
          expect($(elem).data('slot')).toBe(slots[i].getName());
        });
      });

      it("updates buttons when component adds slots", function () {
        doPromise(stooges.add({ slot: 'shemp', value: true }))
          .then(function () {
            var buttons = elem.find('button');
            expect(buttons.eq(3).data('slot')).toBe('shemp');
          });
      });
    });

    describe('#doRead()', function () {
      beforeEach(function () {
        doPromise(widget.load(stooges));
      });

      it('returns the value of the currently active button', function () {
        elem.find('button:contains(curly)').addClass('active');
        expect(widget.read()).toBeResolvedWith('curly');
      });

      it('returns undefined if no button selected', function () {
        expect(widget.read()).toBeResolvedWith(undefined);
      });
    });
  });
});

{%


////////////////////////////////////////////////////////////////
// Pared-down skeleton code
////////////////////////////////////////////////////////////////
} else {



%}
define(['nmodule/{%= name %}/rc/{%= widgetName %}',
        'nmodule/js/rc/jasmine/promiseUtils',
        'jquery'], function (
         {%= widgetName %},
         promiseUtils,
         $) {

  'use strict';

  var doPromise = promiseUtils.doPromise;

  describe('nmodule/{%= name %}/rc/{%= widgetName %}', function () {
    var widget,
        elem;

    beforeEach(function () {
      widget = new {%= widgetName %}();
      elem = $('<div/>');
    });

    describe('#doInitialize()', function () {
      it('does something', function () {
        doPromise(widget.initialize(elem))
          .then(function () {
            //assert something about the widget after initialization.
            //expect(widget.js().text()).toBe('ready to go');
          });
      });
    });

    describe('#doLoad()', function () {
      it('does something', function () {
        doPromise(widget.initialize(elem)
          .then(function () {
            return widget.load('something');
          }))
          .then(function () {
            //assert something about the widget after value is loaded.
            //expect(widget.jq().find('input').val()).toBe('something good'):
          });
      });
    });

    describe('#doRead()', function () {
      it('does something', function () {
        doPromise(widget.initialize(elem)
          .then(function () {
            return widget.load('something good');
          })
          .then(function () {
            return widget.read();
          }))
          .then(function (result) {
            //assert something about the result read from the widget.
            //expect(result).toBe('something {%= superlative() %}');
          });
      });
    });
  });
});

{% } %}
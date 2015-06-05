{%

////////////////////////////////////////////////////////////////
// Non-skeleton, full-fat demo code
////////////////////////////////////////////////////////////////
  if (!skeleton) {

%}
define(['baja!',
        'nmodule/{%= name %}/rc/{%= viewName %}',
        'nmodule/js/rc/jasmine/promiseUtils',
        'jquery'], function (
        baja,
        {%= viewName %},
        promiseUtils,
        $) {

  'use strict';

  var doPromise = promiseUtils.doPromise,
      addCustomMatchers = promiseUtils.addCustomMatchers;

  describe('{%= viewName %}', function () {
    var stooges,
        view,
        elem;

    beforeEach(function () {
      //First set up a mounted component to work with.
      var promise = baja.Ord.make('station:|slot:').get({ lease: true })
        .then(function (station) {
          var method = station.has('stooges') ? 'set' : 'add';
          return station[method]({
            slot: 'stooges',
            value: baja.$('baja:Component', {
              moe: true,
              larry: true,
              curly: true
            })
          });
        })
        .then(function () {
          return baja.Ord.make('station:|slot:/stooges').get({ lease: true });
        });

      //doPromise wraps the promise execution in jasmine runs/waitsFor calls
      //to ensure it completes before continuing with the test.
      doPromise(promise).then(function (s) {
        stooges = s;
      });

      view = new {%= viewName %}();
      elem = $('<div/>');

      doPromise(view.initialize(elem));

      //addCustomMatchers gets us the toBeResolvedWith() matcher along with
      //some others. see the JSDoc for js/rc/jasmine/promiseUtils for details.
      addCustomMatchers(this);
    });

    describe('#doInitialize()', function () {
      it('creates the structure to load buttons into', function () {
        expect(elem.find('.{%= viewName %}-header').length).toBe(1);
        expect(elem.find('.{%= viewName %}-content').length).toBe(1);
      });

      it('arms a handler to set active class on button click', function () {
        var contentDom = elem.find('.{%= viewName %}-content'),
            button = $('<button></button>');

        button.appendTo(contentDom).click();
        expect(button).toHaveClass('active');
      });

      it("removes active class from other buttons when one is clicked", function () {
        var contentDom = elem.find('.{%= viewName %}-content'),
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
        var slotDom = elem.find('.{%= viewName %}-selected-slot');

        runs(function () {
          var contentDom = elem.find('.{%= viewName %}-content'),
              button = $('<button class="{%= viewName %}-button" data-slot="curlyJoe"></button>');

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
        doPromise(view.load(stooges));
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
        doPromise(view.load(stooges));
      });

      it('returns the value of the currently active button', function () {
        elem.find('button:contains(curly)').addClass('active');
        expect(view.read()).toBeResolvedWith('curly');
      });

      it('returns undefined if no button selected', function () {
        expect(view.read()).toBeResolvedWith(undefined);
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
define(['nmodule/{%= name %}/rc/{%= viewName %}',
        'nmodule/js/rc/jasmine/promiseUtils',
        'jquery'], function (
         {%= viewName %},
         promiseUtils,
         $) {

  'use strict';

  var doPromise = promiseUtils.doPromise;

  describe('{%= viewName %}', function () {
    var view,
        elem;

    beforeEach(function () {
      view = new {%= viewName %}();
      elem = $('<div/>');
    });

    describe('#doInitialize()', function () {
      it('does something', function () {
        doPromise(view.initialize(elem))
          .then(function () {
            //assert something about the view after initialization.
            //expect(view.js().text()).toBe('ready to go');
          });
      });
    });

    describe('#doLoad()', function () {
      it('does something', function () {
        doPromise(view.initialize(elem)
          .then(function () {
            return view.load('something');
          }))
          .then(function () {
            //assert something about the view after value is loaded.
            //expect(view.jq().find('input').val()).toBe('something good'):
          });
      });
    });

    describe('#doRead()', function () {
      it('does something', function () {
        doPromise(view.initialize(elem)
          .then(function () {
            return view.load('something good');
          })
          .then(function () {
            return view.read();
          }))
          .then(function (result) {
            //assert something about the result read from the view.
            //expect(result).toBe('something {%= superlative() %}');
          });
      });
    });
  });
});

{% } %}
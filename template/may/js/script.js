var MayBank = MayBank || {};

MayBank = (function(w){
  // global vars
  var vars = {
    header: $('#header'),
    doc: $(document),
    aEls: $('.section-scrollTo a'),
    formatNumber: function(st, nd) {
      var decimal = '.00';
      if(nd){
        decimal = ''
      }
      return st.replace(/(?:(^\d{1,3})(?=(?:\d{3})*$)|(\d{3}))(?!$)/mg, '$1$2,')+decimal;
    },
    template: {
      overlay: '<div class="loading hidden"><img src="/iwov-resources/images/loading.svg" alt=""></div>'
    },
    detect: {
      isMobile: 'ontouchstart' in window || (typeof window.navigator.msMaxTouchPoints !== 'undefined' && window.navigator.msMaxTouchPoints)
    },
    allowKeyNumber : function (evt) {
      var theEvent = evt || window.event;
      var key = theEvent.keyCode || theEvent.which;
      key = String.fromCharCode( key );
      var regex = /[0-9]/;
      if( !regex.test(key) ) {
        theEvent.returnValue = false;
        if(theEvent.preventDefault) theEvent.preventDefault();
      }
    }
  };

  var openModal = function(modal){
    // show modal
    modal.removeClass('hide');
    setTimeout(function(){
      modal.addClass('fadeIn');
    }, 300);
  };

  var closeModal = function(modal, closeCallback){
    // close modal
    modal.removeClass('fadeIn');
    setTimeout(function(){
      modal.addClass('hide');
      if(closeCallback){
        closeCallback();
      }
    }, 300);
  };

  var applyModal = function(trigger, modal, openCallback, closeCallback){
    trigger.on('click.showModal', function(e) {
      e.preventDefault();
      if(openCallback){
        openCallback();
      }
      // show modal
      openModal(modal);
    });
    // close modal
    modal.find('.close,.cancel').on('click.hideModal', function(e) {
      e.preventDefault();
      closeModal(modal, closeCallback);
    });
  };

  // nav
  var mainNav = (function(){
    var el = $('#main-nav');
    var open = function(){
      el.addClass('active');
    };
    var close = function(){
      el.removeClass('active');
    };

    vars.doc.on('click.mainNav',function(e) {
      if(!$(e.target).closest('.inner').length && el.hasClass('active')) {
        close();
      }
    });
    return {
      el: el,
      open: open,
      close: close
    }
  })();

  // add active class for
  var addActiveClass = function(top){
    $('.section-scrollTo a').each(function(){
      var that = $(this);
      var el = $(that.attr('href'));
      if(el.offset().top - vars.header.height() <= top + 200){
        $('.section-scrollTo a').removeClass('active');
        that.addClass('active');
      }
    });
  };

  // parallax
  var bgParallax = function(){
    var prls = $('[data-parallax]');
    if(prls.length && !vars.detect.isMobile){
      var newH = function(oW, oH, nW){
        return nW*oH/oW;
      };

      var detactCase = function(type, oW, oH, nW, nH){
        var hs = {};
        switch(type){
          case 'center':
            hs = {
              halfPosY: -(oH - nH)/2,
              fullPosY: -(newH(oW, oH, nW) - nH)/2
            };
            break;
          default:
            hs = {
              halfPosY: -(oH - nH),
              fullPosY: -(newH(oW, oH, nW) - nH)
            };
        }
        return hs;
      };
      var detectHeight = function(callback){
        prls.each(function(idx){
          var that = $(this);
          var img = new Image();
          var url = that.css('background-image').match(/\((.*?)\)/)[1].replace(/('|")/g,'');
          img.onload = function(){
            var dimension = detactCase(that.data('parallax'), this.width, this.height, that.outerWidth(), that.outerHeight());
            that.data('size', {
              width: this.width,
              height: this.height,
              // halfPosY: -(this.height - that.outerHeight())/2,
              // fullPosY: -(newH(this.width, this.height, that.outerWidth()) - that.outerHeight())/2,
              halfPosY: dimension.halfPosY,
              fullPosY: dimension.fullPosY,
              rate: this.width/this.height
            });
            // if(that.data('parallax') == 'half'){
            //   that.css({
            //     'background-position-y': - (this.height - that.outerHeight()),
            //     'background-size': 'initial'
            //   });
            // }
            // if(that.data('parallax') == 'full'){
            //   that.css('background-position-y', - (newH(this.width, this.height, that.outerWidth()) - that.outerHeight()) );
            // }
            // that.css('background-position-y', - (newH(this.width, this.height, that.outerWidth()) - that.outerHeight()) );
            /* Arahe comment based on Aleph's advise */ //that.css('background-position-y', dimension.fullPosY );
            // that.css({
            //   'transform': 'translate3d(0px, '+ - (this.height - that.outerHeight()) +'px, 0px)'
            // })
            if(callback && idx === prls.length - 1){
              callback();
            }
          };
          img.src = url;
        });
      };

      var getValue = function(a, b, val){
        return val/b*a;
      };
      var detectParallax = function(prls){
        var st = $(w).scrollTop();
        var wH = $(w).height();

        prls.each(function(){
          var _prl = $(this);
          var ost = _prl.offset().top;
          if(st + wH >= (ost) && st < ost + _prl.outerHeight()){
            // if(_prl.data('parallax') == 'half'){
            //   _prl.css({
            //     'background-position-y': getValue(-_prl.data('size').halfPosY, wH + ost, st ) + _prl.data('size').halfPosY,
            //     'background-size': 'initial'
            //   });
            //   // _prl.css('background-position-y', getValue(-_prl.data('size').halfPosY, wH + ost, st ) + _prl.data('size').halfPosY);
            // }
            // if(_prl.data('parallax') == 'full'){
            //   _prl.css('background-position-y', getValue(-_prl.data('size').fullPosY, wH + ost, st ) + _prl.data('size').fullPosY);
            // }
            // _prl.data('size').fullPosY = -(newH(_prl.data('size').width, _prl.data('size').height, _prl.outerWidth()) - _prl.outerHeight())/2
            //_prl.data('size').fullPosY = detactCase(_prl.data('parallax'), _prl.data('size').width, _prl.data('size').height, _prl.outerWidth(), _prl.outerHeight()).fullPosY
            /* Arahe comment based on Aleph's advise */ //_prl.css('background-position-y', getValue(-_prl.data('size').fullPosY, wH + ost, st ) + _prl.data('size').fullPosY);
            // _prl.css({
            //   'transform': 'translate3d(0px, '+ getValue(-_prl.data('size').initPosY, wH + ost, st ) + _prl.data('size').initPosY +'px, 0px)'
            // });
          }
        });
      };
      var timeout = null;
      detectHeight(function(){
        $(w).on('scroll.parallax',function(e) {
          detectParallax(prls);
        }).on('resize.parallax', function(){
          if(timeout){
            clearTimeout(timeout);
          }
          timeout = setTimeout(function(){
            $(w).trigger('scroll.parallax');
          },100);
        }).triggerHandler('scroll.parallax');

      });
    }
  };

  //sticky header and zoom out footer and second-header
  var sticky =  function(){
    var lastScrollTop = 0;
    var secondaryHeader = $('.secondary-header');
    var footer = $('.sticky-footer');

    var stkh = function(st){
      if (st >= 1) {
        //vars.header.addClass('sticky');
		$('#header').addClass('sticky');
        footer.addClass('scrolled');
      }
      else {
        //vars.header.removeClass('sticky');
		$('#header').removeClass('sticky');
        //footer.removeClass('scrolled');
		footer.addClass('scrolled');
      }
	  //footer.addClass('scrolled');
    };

    var sheader = function(st){
      if (st > lastScrollTop && st > secondaryHeader.height()){
        if(secondaryHeader.find('.group-card-compare').children().length == 1 || secondaryHeader.find('.group-compare').children().length == 1 || !secondaryHeader.find('.group-card-compare').children().length || secondaryHeader.find('.group-compare').children().length){
          /*secondaryHeader.addClass('hidden');*/

          if(vars.detect.isMobile){
            secondaryHeader.addClass('hidden');
          }
          else{
            secondaryHeader.stop().slideUp(50);
          }
        }
      } else {
        /*secondaryHeader.removeClass('hidden');*/

        if(vars.detect.isMobile){
          secondaryHeader.removeClass('hidden');
        }
        else{
          secondaryHeader.stop().slideDown(50);
        }
      }
      if(st && secondaryHeader.hasClass('on-top')){
        secondaryHeader.removeClass('on-top');
      }
      else{
        secondaryHeader.addClass('on-top', function(){
          $(this).css({'display':'block'});
        });
      }
      addActiveClass(st);
    };

    $(w).on('scroll.headerHandle',function(e) {
      var st = $(w).scrollTop();

      // sticky header
      stkh(st);
      // second header
      sheader(st);

      lastScrollTop = st;
    }).triggerHandler('scroll.headerHandle');

    if(vars.detect.isMobile) {
      $(w).on('touchmove.headerHandle',function(e) {
        var st = $(w).scrollTop();

        // sticky header
        stkh(st);
        // second header
        sheader(st);

        lastScrollTop = st;
      });
    }
  };

  // scrollToElement
  var scrollTo = function (selector, time, verticalOffset) {
    time = typeof (time) != 'undefined' ? time : 1000;
    verticalOffset = typeof (verticalOffset) != 'undefined' ? verticalOffset : 0;
    element = $(selector);
    offset = element.offset();
    offsetTop = offset.top + verticalOffset;
    $('html, body').animate({
        scrollTop: offsetTop
    }, time);
  }

  var scrollToElement = function(){
    $('.section-scrollTo a').on('click.scrollToElement', function(event) {
      event.preventDefault();
      var section = $(this).attr('href');
      scrollTo(section,200, -vars.header.height());
    });
  };

  // modal
  var initModal = function(){
    var redeemModal = $('#redeem-rewards-modal');
    // var headerModal = $('#header-modal');

    $('.icon-menu').on('click.showMenu', function(e) {
      e.stopPropagation();
      mainNav.open();
      mainNav.el.find('.close').off('click.hideMenu').on('click.hideMenu', function() {
        mainNav.close();
      });
    });

    // select Country
    applyModal($('#choose-country'), $('#select-country'), function(){
      mainNav.close();
    });
    // redeem
    applyModal($('#redeem-rewards'), redeemModal);
    //login
    applyModal( $('.login-btn', vars.header), $('#login-modal'));



    $('#show-login', redeemModal).on('click.showLogin', function(e){
      e.preventDefault();
      redeemModal.find('.close').trigger('click.hideModal');
      $('.login-btn', vars.header).trigger('click.showModalLogin');
    });

    // call confirm popup
    $('[data-open-popup-confirm]').each(function(){
      var that = $(this);
      var pp = $(that.data('open-popup-confirm'));
      var closeCallback = null;
      var request = false;
      if(pp.length){
        if(pp.is('#modal-otp')){
          var nameoncard = $('#nameoncard');
          closeCallback = function(){
            if(request){
              that.siblings('button').prop('disabled', false).removeClass('disabled');
              nameoncard.prop('disabled', false);
            }
          };
          pp.find('.ok').on('click.sendOTP', function(e){
            e.preventDefault();
            request = true;
            pp.find('.close').trigger('click.hideModal');
          });
        }
        applyModal(that, pp, null, closeCallback);
      }
    });

    // $('.mobile').find('.menu-link').on('click.showMenuModal', function(e) {
    //   e.preventDefault();
    //   headerModal.removeClass('hide');
    //   headerModal.find('.close').on('click.hideModal', function() {
    //     headerModal.addClass('hide');
    //   });
    // });
  };


  // chat module
  var moduleChat = function(){
    var searchChat = $('#search-chat');
    var wrapperSearch = $('.wrapper-search', searchChat);
    var innerSearch = $('#inner-search');
    var innerChat = $('.inner-chat');
    var config = $('.config', innerChat);
    var wrapperChat = $('.wrapper-chat', searchChat);
    var searchResult = $('.search-result');
    var modalFoot = $('.modal-foot', searchChat);
    var searchInput = $('#searchInput');

    wrapperSearch.on('click.showSearch', function() {
      $(this).toggleClass('active');
      innerSearch.toggleClass('active');

      $('html,body').css({
        'overflow':'hidden',
        'height': $(window).height()
      });

    });

    $('.close', innerSearch).on('click.closeSearch', function() {
      wrapperSearch.toggleClass('active');
      innerSearch.toggleClass('active');
      searchInput.val('').trigger('keyup.search');
      $('html,body').css({
        'overflow':'auto',
        'height': 'auto'
      });
    });

    $('.close', innerChat).on('click.closeChat', function() {
      wrapperSearch.toggleClass('active');
      innerChat.toggleClass('active');
    });
    searchInput.on('keyup.search', function() {
        if (this.value.length >= 1) {
          searchResult.slideDown();
          innerSearch.addClass('show-result');
          /*modalFoot.hide();*/
        }
        else {
          searchResult.slideUp();
          innerSearch.removeClass('show-result');
          /*modalFoot.show();*/
        }
    });

    $('.chat-field a', innerSearch).on('click.openChat', function(e) {
      wrapperSearch.toggleClass('active');
      innerSearch.toggleClass('active');
      innerChat.toggleClass('active')
      e.stopPropagation();
    });

    config.on('click.openSetting', function(e) {
      var that = $(this);
      if(that.hasClass('active')){
          that.removeClass('active');
          that.find('.options').hide();
      }
      else {
          $('.options').hide();
          config.removeClass('active');
          that.addClass('active');
          that.find('.options').show();
      }
      e.stopPropagation();
    });
    $('html').on('click', function() {
        config.removeClass('active');
        $(this).find('.options').hide();
    });

    $('.minimize', innerChat).on('click.minimizeChat', function(e) {
      innerChat.removeClass('active');
      wrapperChat.show();
    });
    wrapperChat.on('click.openChat', function(e) {
      wrapperSearch.toggleClass('active');
      innerChat.toggleClass('active');

    });
    vars.doc.on('click.moduleChat',function(event) {
      if(!$(event.target).closest('#search-chat').length) {
        wrapperSearch.removeClass('active');
        /*innerSearch.removeClass('active');*/
        searchInput.val('').trigger('keyup.search');
      }
    });

    $('.group-link:not(.no-collapse) h3').on('click.collapseFooter', function(e) {
      $(this).toggleClass('collapsed');
      $(this).siblings('.collapse-content').toggleClass('collapsed');
    });
  };

  // drowdown-link
  var customLink = function(){
    var ctl = $('.custom-link');
    if(ctl.length){
      var cd = $();
      ctl.each(function(){
        var that = $(this);
        var d = $('.dropdown-menu', that);
        that.off('click.customLink').on('click.customLink', function(e){
          e.stopPropagation();
          if(cd.length){
            cd.slideUp(200);
          }
          cd = d;
          d.removeClass('hide').hide().slideDown(200);
        });
      });
      vars.doc.on('click.customLink',function(event) {
        cd.slideUp(200);
      });
    }
  };

  // slider
  var slider = function (){
    if($('.slider-amount').length){
      var sliderAmount = $('.slider-amount');
      sliderAmount.each(function(){
        var that = $(this);
        var min = that.data('min');
        var max = that.data('max');
        var maxUnit = that.find('[data-max-unit]');
        var showValue = that.find('[data-show-value]');
        var step = that.data('step') ? that.data('step') : 1;
        var value = that.data('value') ? that.data('value') : min;
        var slider = $('.range', that);
        var output = $('input', that);
        var type = showValue.data('show-value');
        // var stepValue = step ? step.split('|') : [];
        var sliderRange = $('.fake-slider-range', that);
        var sliderRangeW = sliderRange.closest('.rang-wrapper').outerWidth();
        var ws;
        var dtLoan = $('[data-loan]', that);



        var template = function(type, val){
          output.val(val);
          switch(type){
            case 'currency':
              showValue.text(vars.formatNumber(val));
              break;
            case 'number':
              showValue.text(vars.formatNumber(val, true));
              break;
            case 'multi':
              showValue.text(vars.formatNumber(val, true));
              if(val == 1){
                maxUnit.text(maxUnit.data('min-unit'));
              }
              else{
                maxUnit.text(maxUnit.data('max-unit'));
              }
              break;
            // case 'step':
            //   output.val(stepValue[val - 1]);
            //   break;
          }
        };

        var rderTemplate = function(val){
          slider.slider("value", val);
          template(type, slider.slider('value').toString());
        };

        var autoAnimation = function(min, para, value){
          setTimeout(function(){
            var newVal = para+min;
            if(newVal <=value){
              rderTemplate(newVal);
              // slider.slider("value", newVal);
              // template(type, slider.slider('value').toString());
              autoAnimation(min, newVal, value);
            }
            else{
              rderTemplate(value);
              // slider.slider("value", value);
              // template(type, slider.slider('value').toString());
            }
          },10);
        };

        slider.slider({
          range: 'min',
          value: vars.detect.isMobile ? value : min,
          min: min,
          max: max,
          step: step,
          disabled: that.data('result') ? that.data('result') : false,
          animate: 'slow',
          create: function(event, ui){
            if(sliderRange.length){
              ws = Math.abs(parseFloat(slider.find('span').css('marginLeft')));
              sliderRange.css({
                width: ws + 20
              });
              if(value - min === 0){
                slider.addClass('resetmgl');
              }
            }
          },
          slide:function (event, ui){
            template(type, ui.value.toString());
            if(ui.value - min === 0){
              slider.addClass('resetmgl');
            }
            else{
              slider.removeClass('resetmgl');
            }
            // if(sliderRange.length){
            //   sliderRange.css({
            //     // width: (Math.min((((ui.value - min)/(max-min)*100) + per), 100) + '%')
            //     width: ws + 20
            //     // width: (Math.min(((ui.handle.offsetLeft+26)/(sliderRangeW-26)*100), 100) +'%')
            //   });
            //   //slider.find('.ui-slider-range').attr('style');
            // }
            // console.log(ui);
            // output.val( currency + ' ' + vars.formatNumber(ui.value.toString()));
          }
        });
        if(vars.detect.isMobile){
          template(type, slider.slider('value').toString());
        }
        else{
          var para = min;
          if(!para){
            para = max/100;
          }
          autoAnimation(para, para, value);
          // slider.slider("value", value);
          // template(type, slider.slider('value').toString());
        }
        // output.val(currency + ' ' + vars.formatNumber(slider.slider('value').toString()));
        if(dtLoan.length){
          var wp = dtLoan.closest('.loan-input');
          dtLoan.closest('.input-style').off('click.editSlider').on('click.editSlider', function(){
            wp.addClass('inputing');
            dtLoan.focus();
          });
          dtLoan.off('blur.editSlider').on('blur.editSlider', function(){
            wp.removeClass('inputing');
            rderTemplate(dtLoan.val());
          }).off('keypress.onlyNumber').on('keypress.onlyNumber', vars.allowKeyNumber);
        }
      });
    }
  };
  var rangeSlider = function() {
    if($('.slider-range-limit').length){
      $('.slider-range-limit').each(function(){
        var that = $(this);
        var slider = that.find('.range-wrapper');
        var min = that.data('min'),
            max = that.data('max'),
            valueMin = that.data('value-min'),
            valueMax = that.data('value-max'),
            unit = that.data('unit'),
            showValue = that.find('.text-value');
        slider.slider({
          range: true,
          min: min,
          max: max,
          values: [ valueMin, valueMax ],
          disabled: that.data('result') ? that.data('result') : false,
          slide: function( event, ui ) {
            showValue.text( unit + ' ' + vars.formatNumber(ui.values[ 0 ].toString(), true) + ' - '+ unit + ' ' + vars.formatNumber(ui.values[ 1 ].toString(), true));
          }
        });
        showValue.text(unit + ' ' + vars.formatNumber(slider.slider( 'values', 0 ).toString(), true) + ' - ' + unit + ' ' + vars.formatNumber(slider.slider( 'values', 1 ).toString(), true));
      });

    }
  }
  // card
  var moduleCards = function(){
    //var overlay = $('#loading-state').length ? $('#loading-state') : $(olTemplate).appendTo(document.body);
    var cardFrom = $('[data-module-cards]');
    if(cardFrom.length){
      var cardChooingModal = $('#card-chooing-modal')
      var sl = $('[data-load-template]', cardFrom);
      var modalBody = $('.modal-body', cardChooingModal);
      var options = $('select option', sl);
      var initPp = $(options.filter(':selected').data('modal-template'));

      $('button', cardFrom).on('click.showModal', function(e) {
        if(initPp.length){
          e.preventDefault();
          openModal(initPp);
        }
      });
      //applyModal($('button', cardFrom), cardChooingModal);
      sl.k2Select({
        afterSelect: function(){
          var plugin = this;
          initPp = $(plugin.element.select.find(':selected').data('modal-template'));
          // $.ajax({
          //   url: u,
          //   beforeSend: function(){
          //     overlay.removeClass('hidden');
          //   },
          //   success: function(res){
          //     modalBody.empty().html(res);
          //     slider();
          //     setTimeout(function(){
          //       overlay.addClass('hidden');
          //     }, 300);
          //   },
          //   error: function() {
          //     overlay.addClass('hidden');
          //     window.alert('Please check your network. it could be disconnected');
          //   }
          // });
        }
      });

      options.each(function(){
        var that = $(this);
        var pp = $(that.data('modal-template'));
        // close modal
        pp.find('.close').on('click.hideModal', function(e) {
          e.preventDefault();
          closeModal(pp);
        });
      });
    }
  };

  // CASA
  var moduleCASA = function(){
    var casa = $('[data-casa]');
    if(casa.length){
      var main = $('main');
      var dcrs= [];		
      var dataAccCompare = $('[data-account-compare] ', casa);
      var accounts = $('[data-accounts] [data-account-title]');
      var isCASACard = casa.data('casa-card');
      // savingsCard
      var accountCompare = $('.group-compare', dataAccCompare);
      var accountOnDesk = accountCompare.eq(0);
      var accountOnMobile = accountCompare.eq(1);
      var template;
      var btn = $('button:not([data-compare])', dataAccCompare);
      var btnText = btn.data('text');
      var maxItem = casa.data('max-item');
      // debitcard
      var cardCompare = $('.group-card-compare', dataAccCompare);
      // secondaryHeader
      var secondaryHeader = $('.secondary-header');
      if(!accounts.length){
        accounts = $('[data-accounts] [data-account-photo]');
      }

      var detectCase = function(epx, nt, item){
        switch(epx) {
          case 'saving':
			dcrs.push(item.data("dcr-path"));
			console.log(" dcrs = " + dcrs.length + " item = " + item.data('dcr-path'));
            var title = item.data('account-title');
            nt.attr('title', title).text(title).removeClass('hidden').attr(title);
			nt.attr('data-dcr-path',item.data("dcr-path"));
            nt.data('item', item);
            nt = nt.appendTo(accountCompare);
            break;
          case 'debit':
			dcrs.push(item.data("dcr-path"));
            nt.find('img').attr('src', item.data('account-photo')).end().removeClass('hidden');
			nt.attr('data-dcr-path',item.data("dcr-path"));
            nt.data('item', item);
            nt = nt.appendTo(cardCompare);
            break;
        }
      };

      var renderTemplate = function(item, input){
        var nt = template.clone();
        input.appendTo(nt);
        if(item.data('account-title')){
          detectCase('saving', nt, item);
        }
        else if(item.data('account-photo')){
          detectCase('debit', nt, item);
        }
        nt.data('collect', nt);
        item.data('collect', nt);
      };

      var showHideBtn = function(btnCp, com){
        (btnCp.length - 1) && btn.removeClass('hidden') && com && main.addClass('comparing');
        !(btnCp.length - 1) && btn.addClass('hidden') && com && main.removeClass('comparing');
        secondaryHeader.removeClass('hidden');
      };

      var changeBtnTxt = function(){
        var btnCp = accountOnDesk.find('.btn-compare');
        if(btnText){
          showHideBtn(btnCp, true);
          btn.text(btnText.replace(/\{0\}/g, btnCp.length - 1));
        }
        else{
          btnCp = cardCompare.find('.card-item-photo');
          showHideBtn(btnCp);
          var btnCompare = $('[data-compare]', dataAccCompare);
          (btnCp.length - 1 >= 2) && btnCompare.removeClass('hidden') && main.addClass('comparing');
          (btnCp.length - 1 < 2) && btnCompare.addClass('hidden') && main.removeClass('comparing');
        }
      };

      var savingsCard = function(){
        template = $('.btn-compare.hidden', accountOnDesk);
        //Arahe - Sang How
        if (btnText)
        btnText = btnText.replace(/\{1\}/g, accounts.length);

        accountCompare.on('click.delete','.btn-compare', function(e){
          e.preventDefault();
          var that = $(this);
          that.data('item').removeClass('comparing');
          that.data('collect').remove();
          changeBtnTxt();
		 
		  var index = dcrs.indexOf(that.attr("data-dcr-path"));
		  console.log("DEL 1");
		  console.log(" HTML = " + that.html());
		  console.log(" dcrs = " + dcrs.length + " item = " + that.attr("data-dcr-path"));
		  dcrs.splice(index, 1);
        });
      };

      var debitCard = function(){
        template = $('.card-item-photo.hidden', cardCompare);
      };

      var accountsEvent = function(e){
        e.preventDefault();
        var that = $(this);
        if(!that.hasClass('comparing') && (accountOnDesk.find('.btn-compare').length || cardCompare.find('.card-item-photo').length) <= maxItem){
          that.addClass('comparing');
          renderTemplate(that, that.siblings('input').clone());
		  compareSubmit();
        }
        else{
          that.removeClass('comparing');
          $(that.data('collect')).remove();
		  var index = dcrs.indexOf(that.attr("data-dcr-path"));
		  if (index != -1)
		  {
			  dcrs.splice(index, 1);
		  }
		  console.log("DEL 2");
		  console.log(" dcrs = " + dcrs.length +" INDEX = "+ index + " item = " + that.attr("data-dcr-path"));
		  
        }
        changeBtnTxt();
      };
	  
	  var compareSubmit = function(){
		  var queryString = "DCR_List=";
		  var len = dcrs.length;
		  console.log("dcr "+len);
		  if (len>-1){
			  console.log("INSIDE");
			for (i = 0; i < len; i++) {
				queryString += dcrs[i]+",";
			}
		  }
		  $("#compare-btn").attr("data-submit-url",queryString);
		  console.log("queryString"+queryString);
	  }

      if(isCASACard){
        debitCard();
      }
      else{
        savingsCard();
      }

      accounts.off('click.choose').on('click.choose', $.proxy(accountsEvent));
    }
  };

  // brand card step 4
  var selectBranch = function(){
    var sl = $('[data-district-popup]');
    if(sl.length) {
      var overlay = $('#loading-state').length ? $('#loading-state') : $(vars.template.overlay).appendTo(document.body);
      var branchSelected = $('.branch-selected');
      var districtPopup = $(sl.data('district-popup'));
      var getAddress = function(){
        var t = districtPopup.find(':radio:checked').closest('label').next().clone();
        if(t.length){
          t.removeClass('hidden');
          branchSelected.removeClass('hidden').find('.brand-content').html(t.html());
        }
      };

      // open choosing branch
      $('#branch-choosing').on('click.showModal', function(e){
        e.preventDefault();
        openModal(districtPopup);
      });
      // close choosing branch
      districtPopup.on('click.hideModal', '.close', function(e) {
        e.preventDefault();
        closeModal(districtPopup);
        getAddress();
      });

      sl.k2Select({
        afterSelect: function(){
          var thisSelect = this.element.select;
          var u = thisSelect.find(':selected').data('url');
          var name1 = thisSelect.attr('name');
          var filter = $(sl.attr('data-parameter'));
          var ft = {};
          ft[name1] = thisSelect.val();
          var ft2 = {};
          if(filter){
            var name2 = filter.attr('name');
            ft[name2] = filter.val();
          }
          var data = $.extend({}, ft, ft2);
          if(u){
            $.ajax({
              url: u,
              data: data,
              beforeSend: function(){
                overlay.removeClass('hidden');
              },
              success: function(res){
                setTimeout(function(){
                  overlay.addClass('hidden');
                  districtPopup.empty().html(res);
                  openModal(districtPopup);
                }, 200);
              },
              error: function() {
                overlay.addClass('hidden');
                window.alert('Please check your network. it could be disconnected');
              }
            });
          }
          else{
            branchSelected.addClass('hidden')
          }
        }
      });
    }
  };


  // custom input file
  var checkValidExtension = function(val){
    var validExtension = ['.jpeg', '.jpg', '.gif', '.pdf'];

    return (new RegExp('(' + validExtension.join('|').replace(/\./g, '\\.') + ')$')).test(val);
  };

  var addSted = function(f, cf){
    if(f.val()){
      cf.addClass('selected');
    }
    else{
      cf.removeClass('selected');
    }
  };

  var shortenFileName = function(filename){
    var s = filename.split('\\');
    return s[s.length-1];
  };

  var fileInput = function(ctf){
    var customFile = typeof ctf !== 'undefined' ? ctf : $('.custom-file');
    if(customFile.length){

      customFile.each(function(){
        var cf = $(this);
        var ff = $('input[type="text"]', cf);
        var f = $('input[type="file"]', cf);

        f.on('change.selectFile', function(){
          if(!checkValidExtension(f.val()) && f.val()){
            window.alert(L10n.alert.fileExtension);
          }
          else{
            ff.val(shortenFileName(f.val()));
            addSted(f, cf);
          }
        });
      });
    }
  };

  // add document
  var addDocument = function(){
    var addDoc = $('[data-add-document]');
    if(addDoc.length){
      var addBtn = $('[data-add]', addDoc);
      var tpl = $('[data-document-template]', addDoc);
      var clone = tpl.clone();
      var form = addDoc.closest('form');

      addBtn.on('click.addDocument', function(e){
        e.preventDefault();
        var t = clone.clone().insertAfter(tpl);
        fileInput(t.find('.custom-file'));
        t.find('.custom-select').k2Select();
        form['k2-validation']('updateForm');
      });
    }
  };

  // premier-step2
  var premierStep2 = function(){
    var premierForm = $('#premier-form');
    if(premierForm.length){
      var showHide = $('[data-show-hide]');
      showHide.each(function(){
        var target = $($(this).data('show-hide'));
        var cs = $(this).closest('.custom-select');
        cs.on('afterSelect.premierForm', function(e, plugin){
          if($(plugin.element.select.find(':selected').data('show-hide')).length){
            target.removeClass('hide');
          }
          else {
            target.addClass('hide');
          }
        });
      });
    }
  };

  var ajaxFunc = function(p){
    var overlay = $('#loading-state').length ? $('#loading-state') : $(vars.template.overlay).appendTo(document.body);
    $.ajax({
      url: p.url,
      data: p.data,
      beforeSend: function(){
        overlay.removeClass('hidden');
      },
      success: function(res){
        p.success.call(this, res);
        setTimeout(function(){
          overlay.addClass('hidden');
        }, 300);
      },
      error: function() {
        overlay.addClass('hidden');
        window.alert('Please check your network. it could be disconnected');
      }
    });
  };

  //load more function
  var loadMoreModule = function(){
    var wrload = $('[data-wrapper-load]');
    if(wrload.length){
      wrload.each(function(){
        var wl = $(this);
        var btnlm = $('[data-loadmore]', wl);
        var url = wl.data('wrapper-load');
        var page = 1;
        var upContent = $('[data-update-content]', wl);
        var lastContent = false;

        btnlm.on('click.loadMore', function(e){
          e.preventDefault();
          if(!lastContent){
            ajaxFunc({
              url: url,
              data: {
                page: page
              },
              success: function(res){
                var res = $(res);
                if(res.length){
                  page +=1;
                  res.appendTo(upContent);
                }
                else {
                  lastContent = true;
                  btnlm.addClass('hide');
                }
              }
            });
          }
        });
      });
    }
  };

  var watch = function(){
    var w = $('[data-watch]');
    if(w.length) {
      w.each(function(){
        var t = $(this);
        var min = t.data('min');
        var max = t.data('max');
        var init = t.data('init');
        var wp = t.find('.wrapper');
        var wid = wp.height();
        var input = t.find('input');
        var age = t.find('ul');
        var p = $('.next', t);
        var n = $('.prev', t);
        var renderAge = function(lis, init){
          var c = lis.length
          lis.each(function(idx){
            $(this).text(init - (c - 2 - idx));
          });
          input.val(init);
        };
        // var allowKeyNumber = function (evt) {
        //   var theEvent = evt || window.event;
        //   var key = theEvent.keyCode || theEvent.which;
        //   key = String.fromCharCode( key );
        //   var regex = /[0-9]/;
        //   if( !regex.test(key) ) {
        //     theEvent.returnValue = false;
        //     if(theEvent.preventDefault) theEvent.preventDefault();
        //   }
        // };
        var detectInit = function(min, max, init){
          return Math.min(Math.max(min,init), max);
        };
        var isAnimate = false;
        renderAge(age.children(), init);
        age.css({
          marginTop: -wid
        });
        n.on('click.next', function(e){
          e.preventDefault();
          if(init >= max){
            return;
          }
          if(!isAnimate){
            isAnimate = true;
            age.animate({
              marginTop: -wid*2
            }, 200, function(){
              init +=1;
              renderAge(age.children(), init);
              age.css({
                marginTop: -wid
              });
              isAnimate = false;
            });
          }
        });

        p.on('click.next', function(e){
          e.preventDefault();
          if(init <= min){
            return;
          }
          if(!isAnimate){
            isAnimate = true;
            age.animate({
              marginTop: 0
            }, 200, function(){
              init -=1;
              renderAge(age.children(), init);
              age.css({
                marginTop: -wid
              });
              isAnimate = false;
            });
          }
        });

        wp.on('click.showInput', function(e){
          input.addClass('active');
        });



        input.on({
          'blur.hideInput': function(){
            $(this).removeClass('active');
            init = detectInit(min, max, $(this).val());
            renderAge(age.children(), init);
          },
          'keypress.onlyNumber': vars.allowKeyNumber
        });
      });
    }
  };

  //open income slider
  var incomeSlider = function(){
    var income = $('[data-income]');
    if(income.length){
      income.each(function(){
        var t = $(this);
        var tg = $(t.data('income'));
        t.on('click.showIncomeSlider', function(e){
          e.preventDefault();

          t.addClass('hide');
          if($('[data-income-slide].active').length > 0) {
            console.log(tg);
            console.log(tg.parent());
            tg.appendTo(tg.parent());
          }
          tg.removeClass('hide').addClass('active');

        });
      });
    }
  };

  // world map
  var worldMap = function(){
    var controlMap = $('[data-control-map]');
    if(controlMap.length){
      controlMap.each(function(){
        var that = $(this);
        var desc = $('[data-desc]', that);
        var mapArea = $('map area', that);
        var highlightMap = $('.highlight-map', that).children();
        var c = $();

        mapArea.hover(
          function() {
            c.removeClass('active');
            c = highlightMap.eq($(this).index());
            c.addClass('active');
            desc.html(c.data('content'));
          }, function() {
            c.removeClass('active');
            desc.html(desc.data('desc'))
          }
        );
      });
    }
  };

  // security notification
  var securityNotifincation = function(){
    var sn = $('[data-notification]');
    if(sn.length){
      sn.each(function(){
        var that = $(this);
        var p = $('.prev', that);
        var n = $('.next', that);
        var c = $('.close', that);
        var items = $('.item', that);
        var cI = items.index(items.filter('.active'));
        var distant = -that.outerHeight();
        var margProp = vars.detect.isMobile ? 'margin-bottom' : 'margin-top';
        var closeFunc = function(){
          console.log(margProp);
          distant = -that.outerHeight();
          that.css(margProp, distant);
        };
        p.on('click.prev', function(){
          (cI -=1) && cI < 0 && (cI = items.length - 1);
          items.removeClass('active').eq(cI).addClass('active');
        });
        n.on('click.next', function(e){
          (cI +=1) && cI >= 3 && (cI = 0);
          items.removeClass('active').eq(cI).addClass('active');
        });
        c.on('click.close', function(e){
          e.preventDefault();
          closeFunc();
        });
      });
    }
  };
  var mobileTransfer = function(){
    $('[name = btn-accept]').on('click.accept', function(){
      console.log('accept nha');
      $(this).closest('.modal').find('.close').trigger('click');
      $('input[name=confirm-agree]').prop( 'checked', true );
    });
  }

  var autocomplete = function () {
    $('[data-autocomplete]').each(function() {
      var urlJson = $(this).attr('data-autocomplete');
      $(this).autocomplete({
        valueKey:'title',
        source:[{
          url: urlJson,
          type:'remote',
          getValue:function(item){
            return item.title
          },
          ajax:{
            dataType : 'json'
          }
        }]

      });
    });
  }

  var init = function(){
    sticky();
    initModal();
  };

  return {
    init: init,
    vars: vars,
    scrollToElement: scrollToElement,
    moduleChat: moduleChat,
    customLink: customLink,
    slider: slider,
    rangeSlider: rangeSlider,
    moduleCards: moduleCards,
    moduleCASA: moduleCASA,
    selectBranch: selectBranch,
    fileInput: fileInput,
    addDocument: addDocument,
    premierStep2: premierStep2,
    loadMoreModule: loadMoreModule,
    watch: watch,
    incomeSlider: incomeSlider,
    worldMap: worldMap,
    securityNotifincation: securityNotifincation,
    mobileTransfer : mobileTransfer,
    bgParallax: bgParallax,
    autocomplete: autocomplete
  }
})(window);

$(document).ready(function() {
  MayBank.init();
  MayBank.scrollToElement();
  MayBank.moduleChat();
  MayBank.customLink();
  MayBank.slider();
  MayBank.rangeSlider();
  MayBank.moduleCards();
  MayBank.moduleCASA();
  MayBank.selectBranch();
  MayBank.fileInput();
  MayBank.addDocument();
  MayBank.premierStep2();
  MayBank.loadMoreModule();
  MayBank.watch();
  MayBank.incomeSlider();
  MayBank.worldMap();
  MayBank.securityNotifincation();
  MayBank.mobileTransfer(),
  MayBank.autocomplete(),
  MayBank.bgParallax();
});
/**
 * @preserve jQuery Autocomplete plugin v1.2.6
 * @homepage http://xdsoft.net/jqplugins/autocomplete/
 * @license MIT - MIT-LICENSE.txt
 * (c) 2014, Chupurnov Valeriy <chupurnov@gmail.com>
 */
(function ($) {
	'use strict';
	var	ARROWLEFT = 37,
		ARROWRIGHT = 39,
		ARROWUP = 38,
		ARROWDOWN = 40,
		TAB = 9,
		CTRLKEY = 17,
		SHIFTKEY = 16,
		DEL = 46,
		ENTER = 13,
		ESC = 27,
		BACKSPACE = 8,
		AKEY = 65,
		CKEY = 67,
		VKEY = 86,
		ZKEY = 90,
		YKEY = 89,
		defaultSetting = {},
		//currentInput = false,
		ctrlDown = false,
		shiftDown = false,
		interval_for_visibility,
		publics = {},
		accent_map = {
			'ẚ':'a','Á':'a','á':'a','À':'a','à':'a','Ă':'a','ă':'a','Ắ':'a','ắ':'a','Ằ':'a','ằ':'a','Ẵ':'a','ẵ':'a','Ẳ':'a',
			'Ẫ':'a','ẫ':'a','Ẩ':'a','ẩ':'a','Ǎ':'a','ǎ':'a','Å':'a','å':'a','Ǻ':'a','ǻ':'a','Ä':'a','ä':'a','Ǟ':'a','ǟ':'a',
			'Ã':'a','ã':'a','Ȧ':'a','ȧ':'a','Ǡ':'a','ǡ':'a','Ą':'a','ą':'a','Ā':'a','ā':'a','Ả':'a','ả':'a','Ȁ':'a','ȁ':'a',
			'Ȃ':'a','ȃ':'a','Ạ':'a','ạ':'a','Ặ':'a','ặ':'a','Ậ':'a','ậ':'a','Ḁ':'a','ḁ':'a','Ⱥ':'a','ⱥ':'a','Ǽ':'a','ǽ':'a',
			'Ǣ':'a','ǣ':'a','Ḃ':'b','ḃ':'b','Ḅ':'b','ḅ':'b','Ḇ':'b','ḇ':'b','Ƀ':'b','ƀ':'b','ᵬ':'b','Ɓ':'b','ɓ':'b','Ƃ':'b',
			'ƃ':'b','Ć':'c','ć':'c','Ĉ':'c','ĉ':'c','Č':'c','č':'c','Ċ':'c','ċ':'c','Ç':'c','ç':'c','Ḉ':'c','ḉ':'c','Ȼ':'c',
			'ȼ':'c','Ƈ':'c','ƈ':'c','ɕ':'c','Ď':'d','ď':'d','Ḋ':'d','ḋ':'d','Ḑ':'d','ḑ':'d','Ḍ':'d','ḍ':'d','Ḓ':'d','ḓ':'d',
			'Ḏ':'d','ḏ':'d','Đ':'d','đ':'d','ᵭ':'d','Ɖ':'d','ɖ':'d','Ɗ':'d','ɗ':'d','Ƌ':'d','ƌ':'d','ȡ':'d','ð':'d','É':'e',
			'Ə':'e','Ǝ':'e','ǝ':'e','é':'e','È':'e','è':'e','Ĕ':'e','ĕ':'e','Ê':'e','ê':'e','Ế':'e','ế':'e','Ề':'e','ề':'e',
			'Ễ':'e','ễ':'e','Ể':'e','ể':'e','Ě':'e','ě':'e','Ë':'e','ë':'e','Ẽ':'e','ẽ':'e','Ė':'e','ė':'e','Ȩ':'e','ȩ':'e',
			'Ḝ':'e','ḝ':'e','Ę':'e','ę':'e','Ē':'e','ē':'e','Ḗ':'e','ḗ':'e','Ḕ':'e','ḕ':'e','Ẻ':'e','ẻ':'e','Ȅ':'e','ȅ':'e',
			'Ȇ':'e','ȇ':'e','Ẹ':'e','ẹ':'e','Ệ':'e','ệ':'e','Ḙ':'e','ḙ':'e','Ḛ':'e','ḛ':'e','Ɇ':'e','ɇ':'e','ɚ':'e','ɝ':'e',
			'Ḟ':'f','ḟ':'f','ᵮ':'f','Ƒ':'f','ƒ':'f','Ǵ':'g','ǵ':'g','Ğ':'g','ğ':'g','Ĝ':'g','ĝ':'g','Ǧ':'g','ǧ':'g','Ġ':'g',
			'ġ':'g','Ģ':'g','ģ':'g','Ḡ':'g','ḡ':'g','Ǥ':'g','ǥ':'g','Ɠ':'g','ɠ':'g','Ĥ':'h','ĥ':'h','Ȟ':'h','ȟ':'h','Ḧ':'h',
			'ḧ':'h','Ḣ':'h','ḣ':'h','Ḩ':'h','ḩ':'h','Ḥ':'h','ḥ':'h','Ḫ':'h','ḫ':'h','H':'h','̱':'h','ẖ':'h','Ħ':'h','ħ':'h',
			'Ⱨ':'h','ⱨ':'h','Í':'i','í':'i','Ì':'i','ì':'i','Ĭ':'i','ĭ':'i','Î':'i','î':'i','Ǐ':'i','ǐ':'i','Ï':'i','ï':'i',
			'Ḯ':'i','ḯ':'i','Ĩ':'i','ĩ':'i','İ':'i','i':'i','Į':'i','į':'i','Ī':'i','ī':'i','Ỉ':'i','ỉ':'i','Ȉ':'i','ȉ':'i',
			'Ȋ':'i','ȋ':'i','Ị':'i','ị':'i','Ḭ':'i','ḭ':'i','I':'i','ı':'i','Ɨ':'i','ɨ':'i','Ĵ':'j','ĵ':'j','J':'j','̌':'j',
			'ǰ':'j','ȷ':'j','Ɉ':'j','ɉ':'j','ʝ':'j','ɟ':'j','ʄ':'j','Ḱ':'k','ḱ':'k','Ǩ':'k','ǩ':'k','Ķ':'k','ķ':'k','Ḳ':'k',
			'ḳ':'k','Ḵ':'k','ḵ':'k','Ƙ':'k','ƙ':'k','Ⱪ':'k','ⱪ':'k','Ĺ':'a','ĺ':'l','Ľ':'l','ľ':'l','Ļ':'l','ļ':'l','Ḷ':'l',
			'ḷ':'l','Ḹ':'l','ḹ':'l','Ḽ':'l','ḽ':'l','Ḻ':'l','ḻ':'l','Ł':'l','ł':'l','̣':'l','Ŀ':'l',
			'ŀ':'l','Ƚ':'l','ƚ':'l','Ⱡ':'l','ⱡ':'l','Ɫ':'l','ɫ':'l','ɬ':'l','ɭ':'l','ȴ':'l','Ḿ':'m','ḿ':'m','Ṁ':'m','ṁ':'m',
			'Ṃ':'m','ṃ':'m','ɱ':'m','Ń':'n','ń':'n','Ǹ':'n','ǹ':'n','Ň':'n','ň':'n','Ñ':'n','ñ':'n','Ṅ':'n','ṅ':'n','Ņ':'n',
			'ņ':'n','Ṇ':'n','ṇ':'n','Ṋ':'n','ṋ':'n','Ṉ':'n','ṉ':'n','Ɲ':'n','ɲ':'n','Ƞ':'n','ƞ':'n','ɳ':'n','ȵ':'n','N':'n',
			'̈':'n','n':'n','Ó':'o','ó':'o','Ò':'o','ò':'o','Ŏ':'o','ŏ':'o','Ô':'o','ô':'o','Ố':'o','ố':'o','Ồ':'o',
			'ồ':'o','Ỗ':'o','ỗ':'o','Ổ':'o','ổ':'o','Ǒ':'o','ǒ':'o','Ö':'o','ö':'o','Ȫ':'o','ȫ':'o','Ő':'o','ő':'o','Õ':'o',
			'õ':'o','Ṍ':'o','ṍ':'o','Ṏ':'o','ṏ':'o','Ȭ':'o','ȭ':'o','Ȯ':'o','ȯ':'o','Ȱ':'o','ȱ':'o','Ø':'o','ø':'o','Ǿ':'o',
			'ǿ':'o','Ǫ':'o','ǫ':'o','Ǭ':'o','ǭ':'o','Ō':'o','ō':'o','Ṓ':'o','ṓ':'o','Ṑ':'o','ṑ':'o','Ỏ':'o','ỏ':'o','Ȍ':'o',
			'ȍ':'o','Ȏ':'o','ȏ':'o','Ơ':'o','ơ':'o','Ớ':'o','ớ':'o','Ờ':'o','ờ':'o','Ỡ':'o','ỡ':'o','Ở':'o','ở':'o','Ợ':'o',
			'ợ':'o','Ọ':'o','ọ':'o','Ộ':'o','ộ':'o','Ɵ':'o','ɵ':'o','Ṕ':'p','ṕ':'p','Ṗ':'p','ṗ':'p','Ᵽ':'p','Ƥ':'p','ƥ':'p',
			'P':'p','̃':'p','p':'p','ʠ':'q','Ɋ':'q','ɋ':'q','Ŕ':'r','ŕ':'r','Ř':'r','ř':'r','Ṙ':'r','ṙ':'r','Ŗ':'r',
			'ŗ':'r','Ȑ':'r','ȑ':'r','Ȓ':'r','ȓ':'r','Ṛ':'r','ṛ':'r','Ṝ':'r','ṝ':'r','Ṟ':'r','ṟ':'r','Ɍ':'r','ɍ':'r','ᵲ':'r',
			'ɼ':'r','Ɽ':'r','ɽ':'r','ɾ':'r','ᵳ':'r','ß':'s','Ś':'s','ś':'s','Ṥ':'s','ṥ':'s','Ŝ':'s','ŝ':'s','Š':'s','š':'s',
			'Ṧ':'s','ṧ':'s','Ṡ':'s','ṡ':'s','ẛ':'s','Ş':'s','ş':'s','Ṣ':'s','ṣ':'s','Ṩ':'s','ṩ':'s','Ș':'s','ș':'s','ʂ':'s',
			'S':'s','̩':'s','s':'s','Þ':'t','þ':'t','Ť':'t','ť':'t','T':'t','ẗ':'t','Ṫ':'t','ṫ':'t','Ţ':'t','ţ':'t','Ṭ':'t',
			'ṭ':'t','Ț':'t','ț':'t','Ṱ':'t','ṱ':'t','Ṯ':'t','ṯ':'t','Ŧ':'t','ŧ':'t','Ⱦ':'t','ⱦ':'t','ᵵ':'t',
			'ƫ':'t','Ƭ':'t','ƭ':'t','Ʈ':'t','ʈ':'t','ȶ':'t','Ú':'u','ú':'u','Ù':'u','ù':'u','Ŭ':'u','ŭ':'u','Û':'u','û':'u',
			'Ǔ':'u','ǔ':'u','Ů':'u','ů':'u','Ü':'u','ü':'u','Ǘ':'u','ǘ':'u','Ǜ':'u','ǜ':'u','Ǚ':'u','ǚ':'u','Ǖ':'u','ǖ':'u',
			'Ű':'u','ű':'u','Ũ':'u','ũ':'u','Ṹ':'u','ṹ':'u','Ų':'u','ų':'u','Ū':'u','ū':'u','Ṻ':'u','ṻ':'u','Ủ':'u','ủ':'u',
			'Ȕ':'u','ȕ':'u','Ȗ':'u','ȗ':'u','Ư':'u','ư':'u','Ứ':'u','ứ':'u','Ừ':'u','ừ':'u','Ữ':'u','ữ':'u','Ử':'u','ử':'u',
			'Ự':'u','ự':'u','Ụ':'u','ụ':'u','Ṳ':'u','ṳ':'u','Ṷ':'u','ṷ':'u','Ṵ':'u','ṵ':'u','Ʉ':'u','ʉ':'u','Ṽ':'v','ṽ':'v',
			'Ṿ':'v','ṿ':'v','Ʋ':'v','ʋ':'v','Ẃ':'w','ẃ':'w','Ẁ':'w','ẁ':'w','Ŵ':'w','ŵ':'w','W':'w','̊':'w','ẘ':'w','Ẅ':'w',
			'ẅ':'w','Ẇ':'w','ẇ':'w','Ẉ':'w','ẉ':'w','Ẍ':'x','ẍ':'x','Ẋ':'x','ẋ':'x','Ý':'y','ý':'y','Ỳ':'y','ỳ':'y','Ŷ':'y',
			'ŷ':'y','Y':'y','ẙ':'y','Ÿ':'y','ÿ':'y','Ỹ':'y','ỹ':'y','Ẏ':'y','ẏ':'y','Ȳ':'y','ȳ':'y','Ỷ':'y','ỷ':'y',
			'Ỵ':'y','ỵ':'y','ʏ':'y','Ɏ':'y','ɏ':'y','Ƴ':'y','ƴ':'y','Ź':'z','ź':'z','Ẑ':'z','ẑ':'z','Ž':'z','ž':'z','Ż':'z',
			'ż':'z','Ẓ':'z','ẓ':'z','Ẕ':'z','ẕ':'z','Ƶ':'z','ƶ':'z','Ȥ':'z','ȥ':'z','ʐ':'z','ʑ':'z','Ⱬ':'z','ⱬ':'z','Ǯ':'z',
			'ǯ':'z','ƺ':'z','２':'2','６':'6','Ｂ':'B','Ｆ':'F','Ｊ':'J','Ｎ':'N','Ｒ':'R','Ｖ':'V','Ｚ':'Z','ｂ':'b','ｆ':'f','ｊ':'j',
			'ｎ':'n','ｒ':'r','ｖ':'v','ｚ':'z','１':'1','５':'5','９':'9','Ａ':'A','Ｅ':'E','Ｉ':'I','Ｍ':'M','Ｑ':'Q','Ｕ':'U','Ｙ':'Y',
			'ａ':'a','ｅ':'e','ｉ':'i','ｍ':'m','ｑ':'q','ｕ':'u','ｙ':'y','０':'0','４':'4','８':'8','Ｄ':'D','Ｈ':'H','Ｌ':'L','Ｐ':'P',
			'Ｔ':'T','Ｘ':'X','ｄ':'d','ｈ':'h','ｌ':'l','ｐ':'p','ｔ':'t','ｘ':'x','３':'3','７':'7','Ｃ':'C','Ｇ':'G','Ｋ':'K','Ｏ':'O',
			'Ｓ':'S','Ｗ':'W','ｃ':'c','ｇ':'g','ｋ':'k','ｏ':'o','ｓ':'s','ｗ':'w','ẳ':'a','Â':'a','â':'a','Ấ':'a','ấ':'a','Ầ':'a','ầ':'a'
		};

	if (window.getComputedStyle === undefined) {
		window.getComputedStyle = (function () {
			function getPixelSize(element, style, property, fontSize) {
				var	sizeWithSuffix = style[property],
					size = parseFloat(sizeWithSuffix),
					suffix = sizeWithSuffix.split(/\d/)[0],
					rootSize;

				fontSize = fontSize !== null ? fontSize : /%|em/.test(suffix) && element.parentElement ? getPixelSize(element.parentElement, element.parentElement.currentStyle, 'fontSize', null) : 16;
				rootSize = property === 'fontSize' ? fontSize : /width/i.test(property) ? element.clientWidth : element.clientHeight;

				return (suffix === 'em') ? size * fontSize : (suffix === 'in') ? size * 96 : (suffix === 'pt') ? size * 96 / 72 : (suffix === '%') ? size / 100 * rootSize : size;
			}

			function setShortStyleProperty(style, property) {
				var	borderSuffix = property === 'border' ? 'Width' : '',
					t = property + 'Top' + borderSuffix,
					r = property + 'Right' + borderSuffix,
					b = property + 'Bottom' + borderSuffix,
					l = property + 'Left' + borderSuffix;

				style[property] = (style[t] === style[r] === style[b] === style[l] ? [style[t]]
					: style[t] === style[b] && style[l] === style[r] ? [style[t], style[r]]
						: style[l] === style[r] ? [style[t], style[r], style[b]]
							: [style[t], style[r], style[b], style[l]]).join(' ');
			}

			function CSSStyleDeclaration(element) {
				var	currentStyle = element.currentStyle,
					style = this,
					property,
					fontSize = getPixelSize(element, currentStyle, 'fontSize', null);

				for (property in currentStyle) {
					if (Object.prototype.hasOwnProperty.call(currentStyle, property)) {
						if (/width|height|margin.|padding.|border.+W/.test(property) && style[property] !== 'auto') {
							style[property] = getPixelSize(element, currentStyle, property, fontSize) + 'px';
						} else if (property === 'styleFloat') {
							style.float = currentStyle[property];
						} else {
							style[property] = currentStyle[property];
						}
					}
				}

				setShortStyleProperty(style, 'margin');
				setShortStyleProperty(style, 'padding');
				setShortStyleProperty(style, 'border');

				style.fontSize = fontSize + 'px';

				return style;
			}

			CSSStyleDeclaration.prototype = {
				constructor: CSSStyleDeclaration,
				getPropertyPriority: function () {},
				getPropertyValue: function (prop) {
					return this[prop] || '';
				},
				item: function () {},
				removeProperty: function () {},
				setProperty: function () {},
				getPropertyCSSValue: function () {}
			};

			function getComputedStyle(element) {
				return new CSSStyleDeclaration(element);
			}

			return getComputedStyle;
		}(this));
	}


	$(document)
		.on('keydown.xdsoftctrl', function (e) {
			if (e.keyCode === CTRLKEY) {
				ctrlDown = true;
			}
			if (e.keyCode === SHIFTKEY) {
				ctrlDown = true;
			}
		})
		.on('keyup.xdsoftctrl', function (e) {
			if (e.keyCode === CTRLKEY) {
				ctrlDown = false;
			}
			if (e.keyCode === SHIFTKEY) {
				ctrlDown = false;
			}
		});

	function accentReplace (s) {
		if (!s) { return ''; }
		var ret = '',i;
		for (i=0; i < s.length; i+=1) {
			ret += accent_map[s.charAt(i)] || s.charAt(i);
		}
		return ret;
	}

	function escapeRegExp (str) {
		return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	}

	function getCaretPosition(input) {
		if (!input) {
			return;
		}
		if (input.selectionStart) {
			return input.selectionStart;
		}
		if (document.selection) {
			input.focus();
			var sel = document.selection.createRange(),
				selLen = document.selection.createRange().text.length;
			sel.moveStart('character', -input.value.length);
			return sel.text.length - selLen;
		}
	}

	function setCaretPosition(input, pos) {
		if (input.setSelectionRange) {
			input.focus();
			input.setSelectionRange(pos, pos);
		} else if (input.createTextRange) {
			var range = input.createTextRange();
			range.collapse(true);
			range.moveEnd('character', pos);
			range.moveStart('character', pos);
			range.select();
		}
	}

	function isset(value) {
		return value !== undefined;
	}

	function safe_call(callback, args, callback2, defaultValue) {
		if (isset(callback) && !$.isArray(callback)) {
			return $.isFunction(callback) ? callback.apply(this,args):defaultValue;
		}
		if(isset(callback2)) {
			return safe_call.call(this,callback2,args);
		}
		return defaultValue;
	};

	function __safe( callbackName,source,args,defaultValue ){
		var undefinedVar;
		return safe_call.call( this, (isset(this.source[source])&&
			Object.prototype.hasOwnProperty.call(this.source[source], callbackName)) ? this.source[source][callbackName] : undefinedVar, args, function(){
			return safe_call.call(this,
					isset(this[callbackName][source])?
						this[callbackName][source]:(
							isset(this[callbackName][0])?
								this[callbackName][0]:(
									Object.prototype.hasOwnProperty.call(this, callbackName)?
										this[callbackName]:
										undefinedVar
								)
						),
					args,
					defaultSetting[callbackName][source]||defaultSetting[callbackName][0]||defaultSetting[callbackName],
					defaultValue
			);
		},defaultValue);
	};

	function __get( property,source ){
		if(!isset(source))
			source = 0;

		if( $.isArray(this.source) && isset(this.source[source]) && isset(this.source[source][property]))
			return this.source[source][property];

		if( isset(this[property]) ){
			if( $.isArray(this[property]) ){
				if( isset(this[property][source]) )
					return this[property][source];
				if( isset(this[property][0]) )
					return this[property][0];
				return null;
			}
			return this[property];
		}

		return null;
	};

	function loadRemote( url,sourceObject,done,debug ){
		 if (sourceObject.xhr) {
			sourceObject.xhr.abort();
		 }
		 sourceObject.xhr = $.ajax($.extend(true,{
			url : url,
			type  : 'GET' ,
			async:true,
			cache :false,
			dataType : 'json'
		 },sourceObject.ajax))

		 .done(function( data ){
			done&&done.apply(this,$.makeArray(arguments));
		 })

		 .fail(function( jqXHR, textStatus ){
			if( debug )
				console.log("Request failed: " + textStatus);
		 });
	}


	function findRight( data,query ){
		var right = false,source;

		for (source = 0;source < data.length;source += 1) {
			if( right = __safe.call(this,"findRight",source,[data[source],query,source]) ){
				return {right:right,source:source};
			}
		}

		return false;
	}

	function processData( data,query ){
		var source;
		preparseData
			.call( this,data,query );

		for (source = 0;source < data.length;source += 1) {
			data[source] = __safe.call(this,
				'filter',
				source,
				[data[source], query, source],
				data[source]
			);
		}
	};


	function collectData( query,datasource,callback ){
		var options = this,source;

		if( $.isFunction(options.source) ){
				options.source.apply(options,[query,function(items){
					datasource = [items];
					safe_call.call(options,callback,[query]);
				},datasource,0]);
		}else{
			for (source = 0;source < options.source.length;source += 1) {
				if ($.isArray(options.source[source])) {
					datasource[source] = options.source[source];
				} else if ($.isFunction(options.source[source])) {
					(function (source) {
						options.source[source].apply(options,[query, function(items){
							if (!datasource[source]) {
								datasource[source] = [];
							}

							if (items && $.isArray(items)) {
								switch (options.appendMethod) {
									case 'replace':
										datasource[source] = items;
									break;
									default:
										datasource[source] = datasource[source].concat(items);
								}
							}

							safe_call.call(options,callback,[query]);
						}, datasource,source]);
					}(source));
				} else {
					switch (options.source[source].type) {
						case 'remote':
							if (isset(options.source[source].url)) {
								if (!isset(options.source[source].minLength) || query.length >= options.source[source].minLength){
									var url = __safe.call(options,'replace',source,[options.source[source].url,query],'');
									if (!datasource[source]) {
										datasource[source] = [];
									}
									(function (source) {
										loadRemote(url,options.source[source], function(resp){
											datasource[source] = resp;
											safe_call.call(options,callback,[query]);
										},options.debug);
									}(source));
								}
							}
						break;
						default:
							if( isset(options.source[source]['data']) ){
								datasource[source] = options.source[source]['data'];
							}else{
								datasource[source] = options.source[source];
							}
					}
				}
			}
		}
		safe_call.call(options,callback,[query]);
	};

	function preparseData( data,query ){
		for( var source=0;source<data.length;source++ ){
			data[source] = __safe.call(this,
				'preparse',
				source,
				[data[source],query],
				data[source]
			);
		}
	};

	function renderData( data,query ){
		var  source, i, $div, $divs = [];

		for (source = 0;source < data.length;source += 1) {
			for (i = 0;i < data[source].length;i += 1) {
				if( $divs.length>=this.limit )
					break;

				$div = $(__safe.call(this,
					'render',source,
					[data[source][i],source,i,query],
					''
				));

				$div.data('source',source);
				$div.data('pid',i);
				$div.data('item',data[source][i]);

				$divs.push($div);
			}
		}

		return $divs;
	};

	function getItem( $div,dataset ){
		if( isset($div.data('source')) &&
			isset($div.data('pid')) &&
			isset(dataset[$div.data('source')]) &&
			isset(dataset[$div.data('source')][$div.data('pid')])
		){
			return dataset[$div.data('source')][$div.data('pid')]
		}
		return false;
	};

	function getValue( $div,dataset ){
		var item = getItem($div,dataset);

		if( item ){
			return __safe.call(this,
				'getValue',$div.data('source'),
				[item,$div.data('source')]
			);
		}else{
			if( isset($div.data('value')) ){
				return decodeURIComponent($div.data('value'));
			}else{
				return $div.html();
			}
		}
	};

	defaultSetting = {
		minLength: 0,
		valueKey: 'value',
		titleKey: 'title',
		highlight: true,

		showHint: true,

		dropdownWidth: '100%',
		dropdownStyle: {},
		itemStyle: {},
		hintStyle: false,
		style: false,

		debug: true,
		openOnFocus: false,
		closeOnBlur: true,

		autoselect: false,

		accents: true,
		replaceAccentsForRemote: true,

		limit: 20,
		visibleLimit: 20,
		visibleHeight: 0,
		defaultHeightItem: 30,

		timeoutUpdate: 10,

		get: function (property, source) {
			return __get.call(this,property,source);
		},

		replace: [
			function (url, query) {
				if (this.replaceAccentsForRemote) {
					query = accentReplace(query);
				}
				return url.replace('%QUERY%',encodeURIComponent(query));
			}
		],

		equal:function( value,query ){
			return query.toLowerCase()==value.substr(0,query.length).toLowerCase();
		},

		findRight:[
			function(items,query,source){
				var results = [],value = '',i;
				if (items) {
					for (i = 0;i < items.length;i += 1) {
						value = __safe.call(this,'getValue',source,[items[i],source]);
						if (__safe.call(this, 'equal', source, [value,query,source], false)) {
							return items[i];
						}
					}
				}
				return false;
			}
		],

		valid:[
			function (value, query) {
				if (this.accents) {
					value = accentReplace(value);
					query = accentReplace(query);
				}
				return value.toLowerCase().indexOf(query.toLowerCase())!=-1;

			}
		],

		filter:[
			function (items, query, source) {
				var results = [], value = '',i;
				if (items) {
					for (i = 0;i < items.length;i += 1) {
						value = isset(items[i][this.get('valueKey', source)]) ? items[i][this.get('valueKey', source)] : items[i].toString();
						if (__safe.call(this, 'valid', source, [value, query])) {
							results.push(items[i]);
						}
					}
				}
				return results;
			}
		],

		preparse:function(items){
			return items;
		},

		getValue: [
			function (item, source) {
				return isset(item[this.get('valueKey',source)])?item[this.get('valueKey',source)]:item.toString();
			}
		],

		getTitle: [
			function (item, source) {
				return isset(item[this.get('titleKey',source)])?item[this.get('titleKey',source)]:item.toString();
			}
		],

		render: [
			function (item, source, pid, query) {
				var value = __safe.call(this, "getValue", source, [item, source], defaultSetting.getValue[0].call(this, item, source)),
					title = __safe.call(this, "getTitle", source, [item, source], defaultSetting.getTitle[0].call(this, item, source)),
					_value = '',
					_query = '',
					_title = '',
					hilite_hints = '',
					highlighted = '',
					c, h, i,
					spos = 0;

				if (this.highlight) {
					if (!this.accents) {
						title = title.replace(new RegExp('('+escapeRegExp(query)+')','i'),'<b>$1</b>');
					}else{
						_title = accentReplace(title).toLowerCase().replace(/[<>]+/g, ''),
						_query = accentReplace(query).toLowerCase().replace(/[<>]+/g, '');

						hilite_hints = _title.replace(new RegExp(escapeRegExp(_query), 'g'), '<'+_query+'>');
						for (i=0;i < hilite_hints.length;i += 1) {
							c = title.charAt(spos);
							h = hilite_hints.charAt(i);
							if (h === '<') {
								highlighted += '<b>';
							} else if (h === '>') {
								highlighted += '</b>';
							} else {
								spos += 1;
								highlighted += c;
							}
						}
						title = highlighted;
					}
				}

				return '<div '+(value==query?'class="active"':'')+' data-value="'+encodeURIComponent(value)+'">'
							+title+
						'</div>';
			}
		],
		appendMethod: 'concat', // supported merge and replace
		source:[]
	};
	function init( that,options ){
		if( $(that).hasClass('xdsoft_input') )
				return;

		var $box = $('<div class="xdsoft_autocomplete"></div>'),
			$dropdown = $('<div class="xdsoft_autocomplete_dropdown"></div>'),
			$hint = $('<input readonly class="xdsoft_autocomplete_hint"/>'),
			$input = $(that),
			timer1 = 0,
			dataset = [],
			iOpen	= false,
			value = '',
			currentValue = '',
			currentSelect = '',
			active = null,
			pos = 0;

		//it can be used to access settings
		$input.data('autocomplete_options', options);

		$dropdown
			.on('mousedown', function(e) {
				e.preventDefault();
				e.stopPropagation();
			})
			.on('updatescroll.xdsoft', function() {
				var _act = $dropdown.find('.active');
				if (!_act.length) {
					return;
				}

				var top = _act.position().top,
					actHght = _act.outerHeight(true),
					scrlTop = $dropdown.scrollTop(),
					hght = $dropdown.height();

				if (top <0) {
					$dropdown.scrollTop(scrlTop-Math.abs(top));
				} else if (top+actHght>hght) {
					$dropdown.scrollTop(scrlTop+top+actHght-hght);
				}
			});

		$box
			.css({
				'display':$input.css('display'),
				'width':$input.css('width')
			});

		if( options.style )
			$box.css(options.style);

		$input
			.addClass('xdsoft_input')
			.attr('autocomplete','off');

		$dropdown
			.on('mousemove','div',function(){
				if( $(this).hasClass('active') )
					return true;
				$dropdown.find('div').removeClass('active');
				$(this).addClass('active');
			})
			.on('mousedown touchstart','div',function(){
				$dropdown.find('div').removeClass('active');
				$(this).addClass('active');
				$input.trigger('pick.xdsoft');
			})

		function manageData(){
			if ($input.val()!=currentValue){
				currentValue = $input.val();
			} else {
				return;
			}
			if (currentValue.length < options.minLength) {
				$input.trigger('close.xdsoft');
				return;
			}
			collectData.call(options,currentValue,dataset,function( query ){
				if (query != currentValue) {
					return;
				}
				var right;
				processData.call(options, dataset,query);

				$input.trigger('updateContent.xdsoft');

				if (options.showHint && currentValue.length && currentValue.length<=$input.prop('size') && (right = findRight.call(options,dataset,currentValue))) {
					var title 	=  __safe.call(options,'getTitle',right.source,[right.right,right.source]);
					title = query + title.substr(query.length);
					$hint.val(title);
				} else {
					$hint.val('');
				}
			});

			return;
		}

		function manageKey (event) {
			var key = event.keyCode, right;

			switch( key ){
				case AKEY: case CKEY: case VKEY: case ZKEY: case YKEY:
					if (event.shiftKey || event.ctrlKey) {
						return true;
					}
				break;
				case SHIFTKEY:
				case CTRLKEY:
					return true;
				break;
				case ARROWRIGHT:
				case ARROWLEFT:
					if (ctrlDown || shiftDown || event.shiftKey || event.ctrlKey) {
						return true;
					}
					value = $input.val();
					pos = getCaretPosition($input[0]);
					if (key === ARROWRIGHT && pos === value.length) {
						if (right = findRight.call(options, dataset, value)){
							$input.trigger('pick.xdsoft', [
								__safe.call(options,
									'getValue', right.source,
									[right.right, right.source]
								)
							]);
						} else {
							$input.trigger('pick.xdsoft');
						}
						event.preventDefault();
						return false;
					}
					return true;
				case TAB:
				return true;
				case ENTER:
					if (iOpen) {
						$input.trigger('pick.xdsoft');
						event.preventDefault();
						return false;
					} else {
						return true;
					}
				break;
				case ESC:
					$input
						.val(currentValue)
						.trigger('close.xdsoft');
					event.preventDefault();
					return false;
				case ARROWDOWN:
				case ARROWUP:
					if (!iOpen) {
						$input.trigger('open.xdsoft');
						$input.trigger('updateContent.xdsoft');
						event.preventDefault();
						return false;
					}

					active = $dropdown.find('div.active');

					var next = key==ARROWDOWN?'next':'prev', timepick = true;

					if( active.length ){
						active.removeClass('active');
						if( active[next]().length ){
							active[next]().addClass('active');
						}else{
							$input.val(currentValue);
							timepick = false;
						}
					}else{
						$dropdown.children().eq(key==ARROWDOWN?0:-1).addClass('active');
					}

					if( timepick ){
						$input.trigger('timepick.xdsoft');
					}

					$dropdown
						.trigger('updatescroll.xdsoft');

					event.preventDefault();
					return false;
			}
			return;
		}

		$input
			.data('xdsoft_autocomplete',dataset)
			.after($box)
			.on('pick.xdsoft', function( event,_value ){

				$input
					.trigger('timepick.xdsoft',_value)

				currentSelect = currentValue = $input.val();

				$input
					.trigger('close.xdsoft');

				//currentInput = false;

				active = $dropdown.find('div.active').eq(0);

				if( !active.length )
					active = $dropdown.children().first();

				$input.trigger('selected.xdsoft',[getItem(active,dataset)]);
			})
			.on('timepick.xdsoft', function( event,_value ){
				active = $dropdown.find('div.active');

				if( !active.length )
					active = $dropdown.children().first();

				if( active.length ){
					if( !isset(_value) ){
						$input.val(getValue.call(options,active,dataset));
					}else{
						$input.val(_value);
					}
					$input.trigger('autocompleted.xdsoft',[getItem(active,dataset)]);
					$hint.val('');
					setCaretPosition($input[0],$input.val().length);
				}
			})
			.on('keydown.xdsoft input.xdsoft cut.xdsoft paste.xdsoft', function( event ){
				var ret = manageKey(event);

				if (ret === false || ret === true) {
					return ret;
				}

				setTimeout(function(){
					manageData();
				},1);

				manageData();
			})
			.on('change.xdsoft', function( event ){
				currentValue = $input.val();
			});

		currentValue = $input.val();

		collectData.call(options, $input.val(),dataset,function( query ){
			processData.call(options,dataset,query);
		});

		if( options.openOnFocus ){
			$input.on('focusin.xdsoft',function(){
				$input.trigger('open.xdsoft');
				$input.trigger('updateContent.xdsoft');
			});
		}

		if( options.closeOnBlur )
			$input.on('focusout.xdsoft',function(){
				$input.trigger('close.xdsoft');
			});

		$box
			.append($input)
			.append($dropdown);


		var olderBackground = false,
			timerUpdate = 0;

		$input
			.on('updateHelperPosition.xdsoft',function(){
				clearTimeout(timerUpdate);
				timerUpdate = setTimeout(function(){
					$box.css({
						'display':$input.css('display'),
						'width':$input.css('width')
					});
					$dropdown.css($.extend(true,{
						left:$input.position().left,
						top:$input.position().top + parseInt($input.css('marginTop'))+parseInt($input[0].offsetHeight),
						marginLeft:$input.css('marginLeft'),
						marginRight:$input.css('marginRight'),
						width:options.dropdownWidth=='100%'?$input[0].offsetWidth:options.dropdownWidth
					},options.dropdownStyle));

					if (options.showHint) {
						var style = getComputedStyle($input[0], "");

						$hint[0].style.cssText = style.cssText;

						$hint.css({
							'box-sizing':style.boxSizing,
							borderStyle:'solid',
							borderCollapse:style.borderCollapse,
							borderLeftWidth:style.borderLeftWidth,
							borderRightWidth:style.borderRightWidth,
							borderTopWidth:style.borderTopWidth,
							borderBottomWidth:style.borderBottomWidth,
							paddingBottom:style.paddingBottom,
							marginBottom:style.marginBottom,
							paddingTop:style.paddingTop,
							marginTop:style.marginTop,
							paddingLeft:style.paddingLeft,
							marginLeft:style.marginLeft,
							paddingRight:style.paddingRight,
							marginRight:style.marginRight,
							maxHeight:style.maxHeight,
							minHeight:style.minHeight,
							maxWidth:style.maxWidth,
							minWidth:style.minWidth,
							width:style.width,
							letterSpacing:style.letterSpacing,
							lineHeight:style.lineHeight,
							outlineWidth:style.outlineWidth,
							fontFamily:style.fontFamily,
							fontVariant:style.fontVariant,
							fontStyle:$input.css('fontStyle'),
							fontSize:$input.css('fontSize'),
							fontWeight:$input.css('fontWeight'),
							flex:style.flex,
							justifyContent:style.justifyContent,
							borderRadius:style.borderRadius,
							'-webkit-box-shadow':'none',
							'box-shadow':'none'
						});

						$input.css('font-size',$input.css('fontSize'))// fix bug with em font size

						$hint.innerHeight($input.innerHeight());

						$hint.css($.extend(true,{
							position:'absolute',
							zIndex:'1',
							borderColor:'transparent',
							outlineColor:'transparent',
							left:$input.position().left,
							top:$input.position().top,
							background:$input.css('background')
						},options.hintStyle));


						if( olderBackground!==false ){
							$hint.css('background',olderBackground);
						}else{
							olderBackground = $input.css('background');
						}

						try{
							$input[0].style.setProperty('background', 'transparent', 'important');
						} catch(e) {
							$input.css('background','transparent')
						}

						$box
							.append($hint);
					}
				}, options.timeoutUpdate||1);
			});

		if ($input.is(':visible')) {
			$input
				.trigger('updateHelperPosition.xdsoft');
		} else {
			interval_for_visibility = setInterval(function () {
				if ($input.is(':visible')) {
					$input
						.trigger('updateHelperPosition.xdsoft');
					clearInterval(interval_for_visibility);
				}
			},100);
		}

		$(window).on('resize',function () {
			$box.css({
				'width':'auto'
			});
			$input
				.trigger('updateHelperPosition.xdsoft');
		})

		$input
			.on('close.xdsoft',function(){
				if (!iOpen) {
					return;
				}

				$dropdown
					.hide();

				$hint
					.val('');

				if (!options.autoselect) {
					$input.val(currentValue);
				}

				iOpen = false;

				//currentInput = false;
			})

			.on('updateContent.xdsoft',function(){
				var out = renderData.call(options,dataset,$input.val()),
					hght = 10;

				if (out.length) {
					$input.trigger('open.xdsoft');
				} else {
					$input.trigger('close.xdsoft');
					return;
				}

				$(out).each(function(){
					this.css($.extend(true,{
						paddingLeft:$input.css('paddingLeft'),
						paddingRight:$input.css('paddingRight')
					},options.itemStyle));
				});

				$dropdown
					.html(out);

				if (options.visibleHeight){
					hght = options.visibleHeight;
				} else {
					hght = options.visibleLimit * ((out[0] ? out[0].outerHeight(true) : 0) || options.defaultHeightItem) + 5;
				}

				$dropdown
					.css('maxHeight', hght+'px')
			})

			.on('open.xdsoft',function(){
				if( iOpen )
					return;

				$dropdown
					.show();

				iOpen = true;

				//currentInput = $input;
			})
			.on('destroy.xdsoft',function(){
				$input.removeClass('xdsoft');
				$box.after($input);
				$box.remove();
				clearTimeout(timer1);
				//currentInput = false;
				$input.data('xdsoft_autocomplete',null);
				$input
					.off('.xdsoft')
			});
	};

	publics = {
		destroy: function () {
			return this.trigger('destroy.xdsoft');
		},
		update: function () {
			return this.trigger('updateHelperPosition.xdsoft');
		},
		options: function (_options) {
			if (this.data('autocomplete_options') && $.isPlainObject(_options)) {
				this.data('autocomplete_options', $.extend(true, this.data('autocomplete_options'), _options));
			}
			return this;
		},
		setSource: function (_newsource, id) {
			if(this.data('autocomplete_options') && ($.isPlainObject(_newsource) || $.isFunction(_newsource) || $.isArray(_newsource))) {
				var options = this.data('autocomplete_options'),
					dataset = this.data('xdsoft_autocomplete'),
					source 	= options.source;
				if (id!==undefined && !isNaN(id)) {
					if ($.isPlainObject(_newsource) || $.isArray(_newsource)) {
						source[id] =  $.extend(true,$.isArray(_newsource) ? [] : {}, _newsource);
					} else {
						source[id] =  _newsource;
					}
				} else {
					if ($.isFunction(_newsource)) {
						this.data('autocomplete_options').source = _newsource;
					} else {
						$.extend(true, source, _newsource);
					}
				}

				collectData.call(options, this.val(), dataset,function( query ){
					processData.call(options,dataset,query);
				});
			}
			return this;
		},
		getSource: function (id) {
			if (this.data('autocomplete_options')) {
				var source = this.data('autocomplete_options').source;
				if (id!==undefined && !isNaN(id) &&source[id]) {
					return source[id];
				} else {
					return source;
				}
			}
			return null;
		}
	};

	$.fn.autocomplete = function(_options, _second, _third){
		if ($.type(_options) === 'string' && publics[_options]) {
			return publics[_options].call(this, _second, _third);
		}
		return this.each(function () {
			var options = $.extend(true, {}, defaultSetting, _options);
			init(this, options);
		});
	};
}(jQuery));

;(function($, window, undefined) {
  'use strict';

  var pluginName = 'k2map';
  var loadScript = function(url, callback, location) {
    if (!url || (typeof url !== 'string')) {
      return;
    }
    var script = document.createElement('script');
    script.onload = function() {
      //once the script is loaded, run the callback
      if (callback) {
        callback();
      }
    };
    //create the script and add it to the DOM
    script.src = url;
    document.getElementsByTagName(location ? location : 'head')[0].appendChild(script);
  };
  var olTemplate = '<div class="loading hidden"><img src="/iwov-resources/images/loading.svg" alt=""></div>';
  var loadingOverlay = $('#loading-state').length ? $('#loading-state') : $(olTemplate).appendTo(document.body);
  // var getUID = (function(){
  //   var id = 0;
  //   return function(){
  //     return pluginName + '-' + id++;
  //   };
  // })();
  var isMobile =  'ontouchstart' in window || typeof window.navigator.msMaxTouchPoints !== 'undefined';
  // var win = $(window);
  // var doc = $(document);
  function CustomMarker(LatLngs, map, html) {
    this.LatLngs = LatLngs;
    this.html = html;
    this.div_ = null;
    this.setMap(map);
  }

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var plugin = this;
      var that = plugin.element;
      that.mapEl = that.find(plugin.options.map);
      that.locationEl = that.find(plugin.options.location);
      that.facilitiesEl = that.find(plugin.options.facilities);
      that.markers = that.find(plugin.options.markers);
      that.openSearch = that.find(plugin.options.openSearch);
      that.closeSearch = that.find(plugin.options.closeSearch);
      that.dashboard = that.find(plugin.options.dashboard);

      that.markers.on('click.collapseArea', '.area-item', function(){
        if(!$(this).hasClass('active')){
          $(this).addClass('active').siblings('.area-item').removeClass('active');
          that.overlay.onRemove();
          var html = $(this).find('.area-tooltip');
          plugin.loadMarker(html);
          if(isMobile){
            $('html, body').animate({
              scrollTop: that.mapEl.offset().top
            }, 500);
          }
        }
      });

      that.openSearch.on('click.openSearchOnMobile', function(){
        that.dashboard.removeClass(plugin.options.mobileClass);
      });
      that.closeSearch.on('click.closeSearchOnMobile', function(){
        that.dashboard.addClass(plugin.options.mobileClass);
      });

      that.locationEl.add(that.facilitiesEl).on('afterSelect.gmap', function(){
        that.overlay.onRemove();
        plugin.loadData(that.data('url'), that.locationEl.val(), that.facilitiesEl.val());
      });

      if(typeof google !== 'undefined'){
        plugin.initMap();
      }
      else {
        loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyDymnTGrsha397cQHiPgF4n9t0WfWr-njc', function(){
          plugin.initMap();
        }, 'body');
      }
    },
    loadData: function(url, city, fa){
      var plugin = this;
      var that = plugin.element;
      $.ajax({
        url: url,
        data: {
          city: city,
          fa: fa
        },
        beforeSend: function(){
          loadingOverlay.removeClass('hidden');
        },
        success: function(res){
          that.markers.empty().html(res);
          var html = $(res).filter('.active').find('.area-tooltip');
          //that.closeSearch.trigger('click.closeSearchOnMobile');
          plugin.loadMarker(html);
          setTimeout(function(){
            loadingOverlay.addClass('hidden');
          }, 300);
        },
        error: function() {
          loadingOverlay.addClass('hidden');
          window.alert('Please check your network. it could be disconnected');
        }
      });
    },
    loadMarker: function(html){
      var plugin = this;
      var that = plugin.element;
      var myLatlng = new google.maps.LatLng(html.data('lat'),html.data('lng'));
      // var bounds = new google.maps.LatLngBounds(
      //       new google.maps.LatLng(html.data('lat'),html.data('lng')),
      //       new google.maps.LatLng(that.settings.center.lat, that.settings.center.lng));
      plugin.creatOverlay();
      // that.map.panTo(bounds);
      that.overlay = new CustomMarker(myLatlng, that.map, html[0].outerHTML);
      that.map.setCenter(myLatlng);
    },
    initMap: function(){
      var plugin = this;
      var that = plugin.element;
      that.settings = {
        center: {
          lat: that.data('lat'),
          lng: that.data('lng')
        }
      };
      that.settings = $.extend( {}, plugin.options.settings, that.settings);
      that.map = new google.maps.Map(that.mapEl[0], that.settings);
      plugin.loadData(that.data('url'), that.locationEl.val(), that.facilitiesEl.val());
    },
    creatOverlay: function(){
      CustomMarker.prototype = new google.maps.OverlayView();
      CustomMarker.prototype.onAdd = function() {
        var div = document.createElement('div');
        div.style.borderStyle = 'none';
        div.style.borderWidth = '0px';
        div.style.position = 'absolute';

        $(div).append($(this.html).removeClass('hidden'));

        this.div_ = div;

        // Add the element to the "overlayLayer" pane.
        var panes = this.getPanes();
        panes.overlayLayer.appendChild(div);
      };
      CustomMarker.prototype.draw = function() {
        var overlayProjection = this.getProjection();

        // var sw = overlayProjection.fromLatLngToDivPixel(this.LatLngs.getSouthWest());
        // var ne = overlayProjection.fromLatLngToDivPixel(this.LatLngs.getNorthEast());
        var ps = overlayProjection.fromLatLngToDivPixel(this.LatLngs);

        if (ps && this.div_) {
          var div = this.div_;
          var tt = $(div).children();
          div.style.left = (ps.x - tt.width()/2) + 'px';
          div.style.top = (ps.y - tt.height()) + 'px';
          // div.style.left = sw.x + 'px';
          // div.style.top = ne.y + 'px';
          // div.style.width = (ne.x - sw.x) + 'px';
          // div.style.height = (sw.y - ne.y) + 'px';
        }
      };
      CustomMarker.prototype.onRemove = function() {
        this.div_.parentNode.removeChild(this.div_);
        this.div_ = null;
      };
    },
    destroy: function() {
      $.removeData(this.element[0], pluginName);
    }
  };

  $.fn[pluginName] = function(options, params) {
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (!instance) {
        $.data(this, pluginName, new Plugin(this, options));
      } else if (instance[options]) {
        instance[options](params);
      }
    });
  };

  $.fn[pluginName].defaults = {
    settings: {
      zoom: 11,
      center: {lat: 62.323907, lng: -150.109291},
    },
    map: '#map',
    location: '[data-location]',
    facilities: '[data-facilities]',
    markers: '[data-markers]',
    openSearch: '#search-location-icon',
    dashboard: '.search-locate',
    closeSearch: '.close',
    mobileClass: 'visible-md-up'
  };

  $(function() {
    // $('[data-'+ pluginName +']')[pluginName]();
    $('[data-map-location]')[pluginName]();
  });

}(jQuery, window));

;(function($, window, undefined) {
  'use strict';

  var pluginName = 'k2Select';
  var isMobile =  'ontouchstart' in window || (typeof window.navigator.msMaxTouchPoints !== 'undefined' && window.navigator.msMaxTouchPoints);
  var openedSelect = null;
  var getUID = (function(){
    var id = 0;
    return function(){
      return pluginName + '-' + id++;
    };
  })();
  var win = $(window);
  var doc = $(document);

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var plugin = this;
      var that = plugin.element;
      that.idPlugin = getUID();
      that.select = that.find('select');
      that.customText = that.find(plugin.options.customText);

      if(isMobile){
        plugin.mobile();
      }
      else {
        plugin.desktop();
      }
    },
    desktop: function (){
      var plugin = this;
      var that = plugin.element;
      var closeSelect = function(){
        if(openedSelect){
          openedSelect.hide();
        }
      };
      /* Update for M2U Planner 
	  that.csl = $('<div class="dropdown-menu"><ul></ul></div>').appendTo(document.body);
	  */
	  that.csl = $('<div class="dropdown-menu"><ul id="dropdown-ul"></ul></div>').appendTo(document.body);
      that.items = that.select.children();
      that.itemsLength = that.items.length;

      plugin.template();
      that.csl.hide();

      that.off('click.' +  pluginName).on('click.' +  pluginName, function(e){
        e.stopPropagation();
        if(that.hasClass(plugin.options.focusClass)){
          //plugin.hide();
        }
        else {
          plugin.show();
          closeSelect();
          openedSelect = plugin;
        }
      });
    },
    template: function (){
      var plugin = this;
      var that = plugin.element;
      that.csl = that.csl;
      that.emptyText = !($.trim(that.customText.html()));
      var items  = [];
      that.items.each(function() {
        var self = $(this);
        var activeClass = (self.is(':selected') ? 'active' : '');
        if(self.is(':selected') && !$.trim(self.text())){
          activeClass = 'active hidden';
        }
		
		/* Change for M2U Planner 
        var item = '<li data-value="' + self.val() + '" class="' + activeClass + '"><a href="javascript:void(0);" title="'+ self.text() +'">' + self.text() + '</li>';*/
		var item = '<li onclick="getOption(this)" data-value="' + self.val() + '" class="' + activeClass + '"><a href="javascript:void(0);" title="'+ self.text() +'">' + self.text() + '</li>';

        items.push(item);
        if(self.is(':selected')){
          that.customText.text(self.text());
        }
      });

      that.csl.children().empty().html(items.join(''));
      that.csl.undelegate('.select')
        .delegate('[data-value] a','click.select', function(){
          that.curItem = $(this).parent();
          if(that.curIndex === that.curItem.index()){
            return;
          }
          that.curIndex = that.curItem.index();
          that.customText.text(that.items.eq(that.curIndex).text());
          that.select.prop('selectedIndex', that.curIndex);
          that.curItem.siblings('.active').removeClass('active');
          that.curItem.addClass('active');
          if(plugin.options.afterSelect){
            plugin.options.afterSelect.call(plugin, that.curItem.data('value'));
          }
          that.select.trigger('change.validate');
          that.trigger('afterSelect', plugin);
        });

      if($.trim(that.customText.html())){
        that.addClass(plugin.options.selectedClass);
      }

      if(that.closest('.modal').length){
        var modal = that.closest('.modal');
        that.csl.css('zIndex', modal.css('zIndex'));
        win.on('scroll.modalScroll', function(){
          plugin.setPostition();
        });
        modal.find('.modal-body').on('scroll.modalScroll', function(){
          that.csl.hide();
          plugin.hide();
        });
      }
    },
    setPostition: function(){
      var plugin = this,
          that = plugin.element;
      var top, left, wid;

      top = that.offset().top + (that.data('indent') ? plugin.options.mtop : 0 );
      left = that.offset().left + (that.data('indent') ? plugin.options.mleft : 0 );
      wid = that.outerWidth(true) - (that.data('indent') ? plugin.options.mleft/2 : 0 ) + 1;

      if(that.data('position') === 'right'){
        that.csl.show();
        left = that.offset().left - (that.data('indent') ? plugin.options.mleft/2 : 0 ) + wid - that.csl.outerWidth(true);
        that.csl.css({
          display: 'none',
          top: top,
          // 'max-width': wid,
          left: left
        });
      }
      else{
        that.csl.css({
          //display: 'block',
          top: top,
          'max-width': wid,
          'width': wid,
          left: left
        });
      }

    },
    show: function(){
      var plugin = this,
          that = plugin.element;
      if(that.is(':hidden')){
        return;
      }
      var clearResize = null;
      plugin.setPostition();
      that.csl.slideDown(200);
      that.addClass(plugin.options.focusClass);
      if(that.emptyText){
        that.addClass(plugin.options.selectedClass);
      }
      win.off('resize.' + that.idPlugin + pluginName).on('resize.' + that.idPlugin + pluginName, function(){
        clearTimeout(clearResize);
        clearResize = setTimeout(function(){
          plugin.setPostition();
        }, 200);
      });
      $(document).off('click.' + that.idPlugin + pluginName).on('click.' + that.idPlugin + pluginName, function(){
        plugin.hide();
      });
    },
    hide: function(){
      var plugin = this,
        that = plugin.element;
      that.removeClass(plugin.options.focusClass);
      that.emptyText = !($.trim(that.customText.html()));
      if(that.emptyText){
        that.removeClass(plugin.options.selectedClass);
      }
      // that.csl.hide();
      that.csl.slideUp(200);
      win.off('resize.' + that.idPlugin + pluginName);
      openedSelect = null;
      doc.off('click.' + that.idPlugin + pluginName);
    },
    mobile: function () {
      var plugin = this;
      var that = plugin.element;
      that.emptyText = !($.trim(that.customText.html()));

      that.select.off('change.' + pluginName).on('change.' + pluginName, function(){
        that.customText.text(that.select.find(':selected').text());
        if(plugin.options.afterSelect){
          plugin.options.afterSelect.call(plugin, that.select.val());
        }
        that.select.trigger('blur.' + pluginName);
        that.select.trigger('change.validate');
        that.trigger('afterSelect', plugin);
      });
      that.customText.text(that.select.find(':selected').text());
      that.select.off('focus.' + pluginName).on('focus.' + pluginName, function(){
        that.addClass(plugin.options.focusClass);
        if(that.emptyText){
          that.addClass(plugin.options.selectedClass);
        }
      }).triggerHandler('focus.' + pluginName);
      that.select.off('blur.' + pluginName).on('blur.' + pluginName, function(){
        that.removeClass(plugin.options.focusClass);
        that.emptyText = !($.trim(that.customText.html()));
        if(that.emptyText){
          that.removeClass(plugin.options.selectedClass);
        }
      }).triggerHandler('blur.' + pluginName);
    },
    destroy: function() {
      $.removeData(this.element[0], pluginName);
    }
  };

  $.fn[pluginName] = function(options, params) {
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (!instance) {
        $.data(this, pluginName, new Plugin(this, options));
      } else if (instance[options]) {
        instance[options](params);
      }
    });
  };

  $.fn[pluginName].defaults = {
    customText: '.text',
    afterSelect: null,
    focusClass: 'active',
    selectedClass: 'selected',
    mtop: 5,
    mleft: 5
  };

  $(function() {
    // $('[data-'+ pluginName +']')[pluginName]();
    var els = $('.custom-select').not('[data-load-template],[data-district-popup]');
    if(els.length){
      var olTemplate = '<div class="loading hidden"><img src="/iwov-resources/images/loading.svg" alt=""></div>';
      var overlay = $('#loading-state').length ? $('#loading-state') : $(olTemplate).appendTo(document.body);
      els.each(function(){
        var cts = $(this);
        var sl = $(this).find('select');
        var name1 = sl.attr('name');
        var url = cts.attr('data-url');
        var tg = $(cts.attr('data-target'));
        //var filter = $(cts.attr('data-parameter'));
        var scrollto = $(cts.attr('data-scrollTo'));
        var ft = {};
        ft[name1] = sl.val();
        var ft2 = {};
        // if(filter){
        //   var name2 = filter.attr('name');
        //   ft[name2] = filter.val();
        // }
        var data = $.extend({}, ft, ft2);
        var loadContent = function(u, d){
          $.ajax({
            url: u,
            data: d ? d : null,
            beforeSend: function(){
              overlay.removeClass('hidden');
            },
            success: function(res){
              tg.html(res);
              setTimeout(function(){
                overlay.addClass('hidden');
              }, 300);
            },
            error: function() {
              overlay.addClass('hidden');
              window.alert('Please check your network. it could be disconnected');
            }
          });
        };
        tg.off('click.navigator').on('click.navigator', '.paging > a', function(e){
          e.preventDefault();
          if(!$(this).hasClass('selected') && !$(this).hasClass('disable') && $(this).data('url')){
            loadContent($(this).data('url'));
          }
        });
        var afterSelect = function(){
          var that = $(this);
          var index = that[0].element.select.prop('selectedIndex');
          if(url){
            loadContent(url, data);
          }
          if(scrollto){
            scrollto.find('a').eq(index).trigger('click.scrollToElement');
          }
        };
        cts[pluginName]({
          afterSelect: afterSelect
        });
      });
    }
  });

}(jQuery, window));

;(function($, window, undefined) {
  'use strict';

  var pluginName = 'k2social';

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var plugin = this;
      var that = plugin.element;

      var cocialSharing = function (element, social, link) {
        $(element).attr('href', social + encodeURIComponent(link));
        $(element).attr('target', '_blank');
      };

      cocialSharing(that.find(plugin.options.fbIcon), 'http://www.facebook.com/sharer.php?u=', window.location.href);
      cocialSharing(that.find(plugin.options.twIcon), 'http://twitter.com/share?url=', window.location.href);
      cocialSharing(that.find(plugin.options.ptIcon), 'http://pinterest.com/pin/create/button/?url=', window.location.href);
    },
    destroy: function() {
      $.removeData(this.element[0], pluginName);
    }
  };

  $.fn[pluginName] = function(options, params) {
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (!instance) {
        $.data(this, pluginName, new Plugin(this, options));
      } else if (instance[options]) {
        instance[options](params);
      }
    });
  };

  $.fn[pluginName].defaults = {
    fbIcon: '.icon-facebook',
    twIcon: '.icon-twitter',
    ptIcon: '.icon-pinterest'
  };

  $(function() {
    $('.social-sharing')[pluginName]();
  });

}(jQuery, window));

;(function($, window, undefined) {
  'use strict';

  var pluginName = 'k2-validation';
  var reg = {
    number: /^\d+$/,
    specialCharater: /([\"<>\(\)\'\%\;\+\&\\*?\~\|#@!])+/,
    email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    character: /[\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]+/g
  };

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var plugin = this;
      var that = plugin.element;
      that.disabledBtn = that.find(plugin.options.disabledBtn);

      if(!that.is('form')){
        return;
      }
      plugin.form();

    },
    validateEls: function(els, nomes){
      var plugin = this;
      var that = plugin.element;
      that.valid = true;
      els.each(function(){
        var el = $(this);
        if(!plugin.validate(el, nomes)){
          that.valid = false;
        }
      });
    },
    form: function(){
      var plugin = this;
      var that = plugin.element;

      plugin.updateForm();

      that.find(plugin.options.triggerSubmit).on('click.triggerSubmit', function(e){
        e.preventDefault();
        that.trigger('submit.validate');
      });
      that.off('submit.validate').on('submit.validate', function(e){
        plugin.validateEls(that.els);
        if(!that.valid){
          e.preventDefault();
        } else { 
          e.preventDefault();
          calculateLoan($(that).attr("name"));
        }
        if(plugin.options.afterSubmit){
          e.preventDefault();
          plugin.options.afterSubmit.call(plugin, that);
        }
      });
    },
    updateForm: function(){
      var plugin = this;
      var that = plugin.element;
      that.els = that.find('[data-rules]');

      that.els.each(function(){
        var el = $(this);
        if(el.is(':radio') || el.is(':checkbox')){
          el = $('[name="'+ el.attr('name') +'"]', el.closest(plugin.options.wrapper));
        }
        el.off('keyup.validate change.validate').on('keyup.validate change.validate', function(){
          if(that.disabledBtn.length){
            plugin.validateEls(that.els, true);
            if(that.valid){
              that.disabledBtn.removeClass('disabled').prop('disabled', false);
            }
            else{
              that.disabledBtn.addClass('disabled').prop('disabled', true);
            }
          }
          plugin.validate(el);
        });
      });
    },
    input: function(){
      var plugin = this;
      var that = plugin.element;

      that.off('keyup.validate').on('keyup.validate', function(){
        plugin.validate(that);
      });
    },
    detectError: function(rule, val, el){
      var plugin = this;
      var valid = true;
      switch(rule) {
        case 'required':
          if(el.is(':radio') || el.is(':checkbox')){
            var els = $('[name="'+ el.attr('name') +'"]', el.closest(plugin.options.wrapper));
            valid = els.is(':checked');
          }
          else{
            valid = !!val;
          }
          break;
        case 'email':
          valid = reg.email.test(val);
          break;
        case 'number':
          valid = reg.number.test(val);
          break;
        case 'character':
          var newReg = new RegExp(reg.character);
          valid = newReg.test(val);
          break;
        case 'specialcharacter':
          valid = !reg.specialCharater.test(val);
          break;
      }
      return valid;
    },
    noAllowKeyNumber: function(evt){
      var theEvent = evt || window.event;
      var key = theEvent.keyCode || theEvent.which;
      key = String.fromCharCode( key );
      var regex = /[0-9]/;
      if( regex.test(key) ) {
        theEvent.returnValue = false;
        if(theEvent.preventDefault){
          theEvent.preventDefault();
        }
      }
    },
    bindKeyPress: function(el){
      var plugin = this;
      el.off('keydown.noAllowKeyNumber').on('keydown.noAllowKeyNumber', plugin.noAllowKeyNumber);
    },
    validate: function(el, nomes){
      var plugin = this;
      var rule = el.attr('data-rules').split('|');
      var mes = el.attr('data-error-mes').split('|');
      var valid = true;
      if(el.closest('.hide').length){
        return valid;
      }
      if(rule.indexOf('character') !==-1){
        plugin.bindKeyPress(el);
      }
      for(var i = 0; i < rule.length; i ++){
        valid = plugin.detectError(rule[i], el.val(), el);
        if(!valid && !nomes){
          plugin.setError(valid, el, mes[i]);
          break;
        }
      }
      if(valid && !nomes){
        plugin.setError(valid, el);
      }
      return valid;
    },
    setError: function(valid, el, errormes){
      var plugin = this;
      var wrapper = el.closest(plugin.options.wrapper);
      var error = $(plugin.options.error, wrapper);
      if(valid){
        error.hide();
        wrapper.removeClass(plugin.options.errorClass);
        return;
      }
      wrapper.addClass(plugin.options.errorClass);
      if(error.length){
        error.text(errormes).show();
      }
      else {
        error = $(plugin.options.errorTemplate).text(errormes).appendTo(wrapper);
      }
    },
    destroy: function() {
      $.removeData(this.element[0], pluginName);
    }
  };

  $.fn[pluginName] = function(options, params) {
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (!instance) {
        $.data(this, pluginName, new Plugin(this, options));
      } else if (instance[options]) {
        instance[options](params);
      }
    });
  };

  $.fn[pluginName].defaults = {
    wrapper: '.group',
    error: '.msg-error',
    errorClass: 'error',
    errorTemplate: '<p class="msg-error"></p>',
    disabledBtn: 'button[disabled]',
    triggerSubmit: '.triggerSubmit',
    afterSubmit: null
  };

  $(function() {
    $('[data-'+ pluginName +']')[pluginName]();
    // $('[data-regex]').each(function(){
    //   var el = $(this),
    //   form = el.closest('form');
    //   if(!$.data(form, pluginName)){
    //     el[pluginName]();
    //   }
    // });
  });

}(jQuery, window));

/* jQuery Star Rating Plugin
 *
 * @Author
 * Copyright Nov 02 2010, Irfan Durmus - http://irfandurmus.com/
 *
 * @Version
 * 0.3b
 *
 * @License
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Visit the plugin page for more information.
 * http://irfandurmus.com/projects/jquery-star-rating-plugin/
 *
 */

;(function($){
    $.fn.rating = function(callback){

        callback = callback || function(){};

        // each for all item
        this.each(function(i, v){

            $(v).data('rating', {callback:callback})
                .bind('init.rating', $.fn.rating.init)
                .bind('set.rating', $.fn.rating.set)
                .bind('hover.rating', $.fn.rating.hover)
                .trigger('init.rating');
        });
    };

    $.extend($.fn.rating, {
        init: function(e){
            var el = $(this),
                list = '',
                isChecked = null,
                childs = el.children(),
                i = 0,
                l = childs.length;

            for (; i < l; i++) {
                list = list + '<a class="star" title="' + $(childs[i]).val() + '" />';
                if ($(childs[i]).is(':checked')) {
                    isChecked = $(childs[i]).val();
                };
            };

            childs.hide();

            el
                .append('<div class="stars">' + list + '</div>')
                .trigger('set.rating', isChecked);

            $('a', el).bind('click', $.fn.rating.click);
            el.trigger('hover.rating');
        },
        set: function(e, val) {
            var el = $(this),
                item = $('a', el),
                input = undefined;

            if (val) {
                item.removeClass('fullStar');

                input = item.filter(function(i){
                    if ($(this).attr('title') == val)
                        return $(this);
                    else
                        return false;
                });

                input
                    .addClass('fullStar')
                    .prevAll()
                    .addClass('fullStar');
            }

            return;
        },
        hover: function(e){
            var el = $(this),
                stars = $('a', el);

            stars.bind('mouseenter', function(e){
                // add tmp class when mouse enter
                $(this)
                    .addClass('tmp_fs')
                    .prevAll()
                    .addClass('tmp_fs');

                $(this).nextAll()
                    .addClass('tmp_es');
            });

            stars.bind('mouseleave', function(e){
                // remove all tmp class when mouse leave
                $(this)
                    .removeClass('tmp_fs')
                    .prevAll()
                    .removeClass('tmp_fs');

                $(this).nextAll()
                    .removeClass('tmp_es');
            });
        },
        click: function(e){
            e.preventDefault();
            var el = $(e.target),
                container = el.parent().parent(),
                inputs = container.children('input'),
                rate = el.attr('title');

            matchInput = inputs.filter(function(i){
                if ($(this).val() == rate)
                    return true;
                else
                    return false;
            });

            matchInput
                .prop('checked', true)
        .siblings('input').prop('checked', false);

            container
                .trigger('set.rating', matchInput.val())
                .data('rating').callback(rate, e);
        }
    });

})(jQuery);

$(function() {
    $('.rating-container').rating(function(vote, event){
        $.ajax({
            url: "/get_votes.php",
            type: "GET",
            data: {rate: vote},
        });
    });
});

;(function($, window, undefined) {
  'use strict';

  var pluginName = 'slickSlider';

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this;
      that.element.slick(that.options);
    },
    destroy: function() {
      $.removeData(this.element[0], pluginName);
    }
  };

  $.fn[pluginName] = function(options, params) {
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (!instance) {
        $.data(this, pluginName, new Plugin(this, options));
      } else if (instance[options]) {
        instance[options](params);
      }
    });
  };

  $.fn[pluginName].defaults = {
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  $(function() {
    $('.feature-carousel').slick({
       arrows: false,
       infinite: true,
       slidesToShow: 1,
       slidesToScroll: 1,
       dots: true
    });
    $('.mobile .general-plan').slick({
      arrows: false,
      dots: false,
      centerMode: true,
      centerPadding: '10',
      slidesToShow: 1
    });
  });

}(jQuery, window));

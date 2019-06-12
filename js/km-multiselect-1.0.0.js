/**
 * Plugin Name: KM Multiselect
 * Author: Kiran Mulmi
 *
 * */
(function ($) {
  $.fn.kmMultiselect = function (options) {

    var _wrapper = $(this);

    var _defaults = {
      subject: 'Select an option',
      multiple: true,
      search: true,
      height: 240,
      checkAll: true,
      selectedTexts: true,
      url: false
    };

    var optionValuePair = {};
    var optionValuePairChekbox = {};

    var multiselectUID = 'km-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + '-multiselect';

    var _settings = $.extend({}, _defaults, options);

    var multiselect = {

      processData: function () {

        if (_settings.url) {
          $.ajax({
            url: _settings.url,
            type: 'get',
            dataType: 'json',
            success: function (response) {
              var result = response.data;
              if (result.length > 0) {
                result.forEach(function (d) {
                  optionValuePair[d.key] = d.value;
                  optionValuePairChekbox[d.key] = d.isDefault;
                  _wrapper.append(new Option(d.value, d.key));
                });
              }

              multiselect.drawLayout();
              multiselect.deligateFunctions();

            }
          })
        }
        else {
          _wrapper.find('option').each(function () {

            var json = {};

            var val = $(this).val();
            var text = $(this).text();
            var chk = false;

            if (_wrapper.val() != null && _wrapper.val() != "") {
              _wrapper.val().forEach(function (d) {
                if (d == val) {
                  chk = true;
                }
              });
            }

            if (val != "") {
              optionValuePair[val] = text;
              optionValuePairChekbox[val] = chk;
            }

          });

          multiselect.drawLayout();
          multiselect.deligateFunctions();
        }

      },
      init: function () {
        if (_settings.multiple) {
          _wrapper.attr('multiple', true);
        }
        _wrapper.addClass('km-multiselect-display-none');
        multiselect.processData();
      },
      drawLayout: function () {
        _wrapper.parent().find('.km-multiselect').remove();

        var html = '<div class="km-multiselect">' +
            '<div class="km-multiselect-selectBox-above-header-info"></div>' +
            '<div class="km-multiselect-selectBox">' +
            '<select>' +
            '<option>' + _settings.subject + '</option>' +
            '</select>' +
            '<div class="km-multiselect-overSelect"></div>' +
            '</div>' +
            '<div class="km-checkboxes km-multiselect-display-none">';


        if (_settings.checkAll && _settings.multiple == true) {
          html += '<div><span class="km-multiselect-check-all-tick">Check All</span> <span class="km-multiselect-uncheck-all-tick">Uncheck All</span></div>';
        }
        if (_settings.search) {
          html += '<div><input type="text" placeholder="Search.." class="km-multiselect-option-search"></div>';
        }
        $.each(optionValuePair, function (key, value) {
          var chk = '';
          if (optionValuePairChekbox[key]) {
            chk = 'checked="checked"';
          }
          if (_settings.multiple) {
            html += '<label class="km-multiselect-checkbox-label">' +
                '<input type="checkbox" class="km-multiselect-checkbox-input" ' + chk + ' data-km-select-value="' + key + '" data-km-select-text="' + value + '"/>' +
                value +
                '</label>'
          }
          else {
            html += '<label class="km-multiselect-checkbox-label">' +
                '<input type="radio" class="km-multiselect-checkbox-input" ' + chk + ' data-km-select-value="' + key + '" data-km-select-text="' + value + '"/>' +
                value +
                '</label>'
          }
        });

        html += '</div></div>';
        _wrapper.after(html);
        multiselect.afterDrawLayout();

      },
      afterDrawLayout: function () {
        setTimeout(function () {
          var width = _wrapper.parent().find('.km-multiselect-overSelect').width();
          _wrapper.parent().find('.km-checkboxes').css({
            'width': width - 10,
            'max-height': _settings.height,
            'overflow-y': 'auto'
          });
          multiselect.titleRebuild();
        }, 200);
      },
      titleRebuild: function () {
        var Values = new Array();
        var Labels = new Array();
        var count = 0;
        _wrapper.parent().find('.km-multiselect-checkbox-input').each(function () {
          if ($(this).is(':checked')) {
            Values.push($(this).attr('data-km-select-value'));
            Labels.push($(this).attr('data-km-select-text'));
            count++;
          }
        });

        var title = Labels.length > 0 ? Labels.toString() : _settings.subject;
        _wrapper.parent().find('.km-multiselect-selectBox select option:first').text(title);
        _wrapper.val(Values).trigger('change');
        if (_settings.selectedTexts) {
          _wrapper.parent().find('.km-multiselect-selectBox-above-header-info').html('Selected Items (' + count + ')')
        }
      },
      deligateFunctions: function () {
        _wrapper.parent().find('.km-multiselect-selectBox').on('click', function () {
          _wrapper.parent().find('.km-checkboxes').toggleClass('km-multiselect-display-none');
        });

        _wrapper.parent().find('.km-multiselect-checkbox-input').on('click', function () {
          if (!_settings.multiple) {
            _wrapper.parent().find('.km-multiselect-checkbox-input').each(function () {
              $(this).prop('checked', false);
            });
            $(this).prop('checked', true);
          }
          multiselect.titleRebuild();
        });

        _wrapper.parent().on('keyup', '.km-multiselect-option-search', function () {
          var val = $(this).val().toLowerCase();

          _wrapper.parent().find('.km-multiselect-checkbox-input').each(function () {
            var label = $(this).attr('data-km-select-text').toLowerCase();
            var search = label.search(val);
            if (search < 0 && val != '') {
              $(this).parent('label').hide();
            }
            else {
              $(this).parent('label').show();
            }
          });

        });

        _wrapper.parent().on('click', '.km-multiselect-check-all-tick', function () {
          _wrapper.find('option').each(function () {
            $(this).attr('selected', 'selected');
            optionValuePair[$(this).val()] = $(this).text();
          });

          $.each(optionValuePair, function (key, value) {
            optionValuePairChekbox[key] = true;
          });

          _wrapper.parent().find('.km-multiselect-checkbox-input').each(function () {
            $(this).prop('checked', true);
          });

          multiselect.titleRebuild();
        });

        _wrapper.parent().on('click', '.km-multiselect-uncheck-all-tick', function () {
          _wrapper.find('option').each(function () {
            $(this).removeAttr('selected')
            optionValuePair[$(this).val()] = $(this).text();
          });

          $.each(optionValuePair, function (key, value) {
            optionValuePairChekbox[key] = false;
          })

          _wrapper.parent().find('.km-multiselect-checkbox-input').each(function () {
            $(this).prop('checked', false);
          });

          multiselect.titleRebuild();

          _wrapper.trigger('change');
        });

        $('body').click(function (e) {

          if ($(e.target).parents('.km-multiselect').length == 0) {
            _wrapper.parent().find('.km-checkboxes').addClass('km-multiselect-display-none');
          }

        });
      }
    }

    multiselect.init();
  }

})(jQuery);
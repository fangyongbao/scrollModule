/* 
 * author : fang yongbao
 * data : 2014.05.30
 * model : 无缝滚动
 * verson : 1.0
 * info ：知识在于积累，每天一小步，成功永远属于坚持的人。
 * parameter :
 *     _auto : (Boolean)是否自动滚动
 *     _time ： (int)滚动的时间 单位（ms）
 *     _leftObj ： (#+string)左按钮Id
 *     _rightObj ： (#+string)有按钮Id
 *     _easing ：滚动的效果（需要引入jquery.easing.js）
 *     _ispager : (Boolean)是否开启锚点
 *     _pager ： (#+string)锚点Id，当_ispager为ture时设置
 *
 *
 *
 *
 */
(function($) {
	$.fn.scrollModule = function(option) {
		var defaults = {
			_auto: false,
			_time: 500,
			_width: 700,
			_leftObj: '#left',
			_rightObj: '#right',
			_ispager: false,
			_pager: '#pager',
			_easing: 'linear',
			_loopId: null
		};
		var _this = this;

		/*************set parameter*******************************/
		_this.option = $.extend(defaults, option);
		_this.option._distance = -_this.option._width;

		_this.init = function() {


			_this.option._ispager && _this.pager();

			/*************cloneElement***************************/
			var firstChildObj = $(this).children("li").first().clone();
			var lastChildObj = $(this).children("li").last().clone();
			$(this).append(firstChildObj).prepend(lastChildObj);

			/********children length****************/
			_this.option._length = $(this).children("li").length;

			/********set parent length****************/
			_this.css({
				width: _this.option._length * _this.option._width
			});

			/********set child length****************/
			_this.children("li").css({
				width: _this.option._width
			});

			_this.option._allkey = _this.option._length - 1;
			_this.option._i = 1;

			$(this).css("left", _this.option._distance);

			_this.bindEvent();

			if (_this.option._auto) {
				_this.loop();


				_this.on("mouseenter", function() {
					clearInterval(_this.option._loopId);
					_this.option._loopId = null;
				});
				_this.on("mouseleave", function() {
					_this.loop();
				});
			}
		};

		_this.pager = function() {
			var _length = $(this).children("li").length;
			var _content = "";
			for (var i = 1; i <= _length; i++) {
				if (i == 1) {
					_content += "<a class='current'>" + i + "</a>";
				} else {
					_content += "<a>" + i + "</a>";
				}
			}

			_content = $("<div id=" + _this.option._pager.slice(1) + " style='position:absolute;bottom:0;'>" + _content + "</div>");
			$(this).parent().append(_content);

			$(_this.option._pager).children('a').on('click', function() {
				var _currentAnchor = $(this);
				var _index = _currentAnchor.index();
				_this.stop(true, true).animate({
					left: _this.option._distance * (_index + 1)
				}, _this.option._time, function() {

					_this.option._i = _index + 1;
					_this.changePager();
				});
			});
		};

		_this.bindEvent = function() {
			$(_this.option._leftObj).on("click", function() {
				_this.stop(true, true).animate({
					left: _this.option._distance * (_this.option._i - 1)
				}, _this.option._time, function() {
					_this.option._i--;
					if (_this.option._i == 0) {
						_this.css("left", (_this.option._allkey - 1) * _this.option._distance + "px");
						_this.option._i = _this.option._allkey - 1;
					}
					_this.changePager();

				});
			});

			$(_this.option._rightObj).on("click", function() {
				_this.stop(true, true).animate({
					left: _this.option._distance * (_this.option._i + 1)
				}, _this.option._time, function() {
					_this.option._i++;
					if (_this.option._i == _this.option._allkey) {
						_this.css("left", _this.option._distance);
						_this.option._i = 1;
					}
					_this.changePager();

				});
			});
		};

		_this.loop = function() {
			_this.option._loopId = setInterval(function() {
				$(_this.option._rightObj).click();
			}, 4000);
		};

		_this.changePager = function() {
			var _index = _this.option._i - 1;
			$(_this.option._pager).children('a:eq(' + _index + ')').addClass('current').siblings().removeClass('current');
		};


		return _this;

	};
})(jQuery);
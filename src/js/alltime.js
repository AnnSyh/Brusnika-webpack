(function($) {
	var ALLTIME = (function() {

		var $sel = {};
		$sel.window = $(window);
		$sel.html = $("html");
		$sel.body = $("body", $sel.html);
		$sel.page = $(".page", $sel.html);

		return {
			init: function() {
				var self = this;

				self.header.init();

				self.pager.init();
				self.popups.init();
				self.tooltips.init();
				self.forms.init();

				self.copyBlock.init();

				self.catalog.init();
				self.filter.init();

				self.order.init();

				self.brands.init();

				self.navigation.init();

				self.search.init();

				self.home.init();
				
				
				self.content.init();


				self.anchors.init();

				self.countdown.init();


				self.shops.init();


				self.toggle.init();
				self.tabs.init();
				self.accordion.init();

				self.action.init();


				self.slides.init();


				self.common.window.init();


				self.footer.init();


				self.animation.init();

				self.mobile.init();


				self.fix();

				self.lazyLoad();
			},


			header: {
				init: function() {
					var self = this;

					if($sel.window.width() > 1000) {
						self.logo();
					};

					self.location();
					
				},
				logo: function() {
					var bottomPos = 250,
						$logo = $(".header-logo", $sel.page);
					$sel.window.on("scroll", function() {
						//setTimeout(function() {
							var percent = (bottomPos - parseInt($sel.window.scrollTop())) / bottomPos;
							if(percent < 0) {
								percent = 0;
							}
							if(percent > 1) {
								percent = 1;
							}
							$logo.css({
								"opacity": percent,
								"transform": "scale(" + percent +")"
							});
						//}, 100);
					});
				},

				location: function() {
					$("#header-cities-form-input", $sel.body).suggestions({
						token: "58a86009d22641d264039312b8f964d1cff719f1",
						type: "ADDRESS",
						hint: false,
						bounds: "city",
						constraints: {
							label: "",
							locations: {
								city_type_full: "город"
							}
						},
						onSelect: function(item) {
							console.log(item);
						}
					});
				}
			},


			slides: {
				init: function() {
					$(".slides-items[data-slider]", $sel.page).each(function() {
						var $s = $(this),
							params = $s.data("slider");
						$s.slick($.extend({
							slidesToShow: 5,
							slidesToScroll: 3,
							dots: false,
							arrows: true,
							infinite: false,
							autoplay: false,
							speed: 1600,
							responsive: [
								{
									breakpoint: 1024,
									settings: {
										slidesToShow: 3,
										slidesToScroll: 3,
										arrows: false,
										dots: true
									}
								}, {
									breakpoint: 550,
									settings: {
										slidesToShow: 2,
										slidesToScroll: 2,
										arrows: false,
										dots: true
									}
								}
							]
						}, params));
					});
				}
			},


			home: {
				init: function() {
					$(".main-slider-items", $sel.page).on("init", function(e, slick) {
						if(slick.slideCount <= 1) {
							slick.$dots.hide();
						}
					}).slick({
						slidesToShow: 1,
						slidesToScroll: 1,
						dots: true,
						arrows: false,
						autoplay: true,
						autoplaySpeed: 3000,
						speed: 900
					});
				}
			},
			
			
			content: {
				init: function() {
					$(".features-items--mobile_slider", $sel.page).slick({
						slidesToShow: 1,
						slidesToScroll: 1,
						dots: true,
						arrows: false,
						autoplay: true,
						autoplaySpeed: 3000,
						speed: 900,
						mobileFirst: true,
						responsive: [
							{
								breakpoint: 990,
								settings: "unslick"
							}
						]
						
					});
				}	
			},


			anchors: {
				init: function() {
					$(".page-anchor", $sel.page).on("click", function(e) {
						e.preventDefault();

						var $link = $(this);
						
						ALLTIME.common.go($($link.attr("href")).offset().top, 500);
					});
				}
			},


			countdown: {
				init: function() {
					$(".countdown", $sel.page).each(function() {
						var $cd = $(this);

						$cd.countdown($cd.data("final"), function(e) {
							$(this).html(e.strftime('%H:%M:%S'));
						});
					});
				}
			},


			footer: {
				$top: null,

				init: function() {
					var self = this;
				
					self.$top = $("#page-top", $sel.body);

					self.actions();
				},

				actions: function() {
					var self = this;

					
					var scrollTimer = null;
					$sel.window.on("scroll", function() {
						self.$top.addClass("active");
						
						if(scrollTimer !== null) {
							clearTimeout(scrollTimer);
						}
						
						scrollTimer = setTimeout(function() {
							self.$top.removeClass("active");
						}, 2000);
					});

					self.$top.on("click", function(e) {
						e.preventDefault();
						if(self.$top.hasClass("active")) {
							ALLTIME.common.go(0, 500);
						}
					});
				}
			},



			shops: {
				init: function() {
					var self = this;

					if(window.ymaps && window.ymaps !== undefined) {
						ymaps.ready(function() {
							self.maps();
						});
					}

					$(".open-shop-route", $sel.page).on("click", function(e) {
						e.preventDefault();
						var $link = $(this);
						$($link.attr("href")).toggleClass("show");
					});

					self.slider();
				},

				maps: function($container) {
					if(!$container) {
						$container = $sel.page;
					}
					$(".shop-map-yandex", $container).each(function() {
						(function($map) {
							var yMap = false,
								info = $map.data("info");
							yMap = new ymaps.Map($map[0], {
		            			center: eval(info.center), 
		            			zoom: info.zoom
		        			});
			        		yMap.behaviors.disable("scrollZoom");
			        		yMap.controls.remove("trafficControl").remove("scaleLine").remove("typeSelector").remove("searchControl");

			        		if(info.points) {
			        			
			        			var yPoints = new ymaps.Clusterer(null, {});
			        			for(var i = 0; i < info.points.length; i++) {
			        				var point = info.points[i];
				        			yPoints.add(new ymaps.Placemark(
					        			eval(point.coords),
					        			{
					        				id: point.id,
					        				title: point.title,
					        				balloonContent: '<div class="map-baloon page-text page-text--small">' + point.balloon + '</div>'
					        			}, {
								        	preset: "islands#icon",
								        	iconColor: "#153B6E",
					        			}
					        		));
			        			}
			        			yMap.geoObjects.add(yPoints);

			        		} else {
				        		var placemark = new ymaps.Placemark(
				        			eval(info.center),
				        			{
				        				balloonContent: (info.balloon ? '<div class="map-baloon page-text page-text--small">' + info.balloon + '</div>': ''),
				        			},
				        			{
										iconLayout: "default#image",
										iconImageHref: "../i/map_icon_active.png",
										iconImageSize: [54, 54],
										iconImageOffset: [-27, -54],
										hideIconOnBalloonOpen: false,
										balloonOffset: (info.balloon ? [-405, 200] : [0, 0]),
										balloonMaxHeight: (info.balloon ? 500 : 300),
				        			}
				        		);
			        			yMap.geoObjects.add(placemark);
			        		}



		        			if(info.balloon) {
		        				placemark.balloon.open();
		        			}


		        			if(info.addRoute) {
		        				yMap.controls.add("routePanelControl");

		        				var routeControl = yMap.controls.get("routePanelControl");
								
								routeControl.routePanel.state.set({
									toEnabled: false,
									to: eval(info.center),
									fromEnabled: true
								});
								routeControl.options.set({
									maxWidth: "310px"
								});
		        			}

			        	}($(this)));
			        });
				},

				slider: function() {
					$(".shop-photos", $sel.page).each(function() {
						var $holder = $(this),
							$slider = $(".shop-catalog-photos-items", $holder),
							$nav = $(".shop-catalog-photos-nav-items", $holder);
						
						(function($slider, $nav) {
							
							$slider.slick({
								slidesToShow: 1,
								slidesToScroll: 1,
								dots: false,
								arrows: false,
								infinite: false,
								autoplay: false,
								speed: 800,
								asNavFor: $nav,
								responsive: [
									{
										breakpoint: 1000,
										settings: {
											dots: true
										}
									}
								]
							});

							$nav.slick({
								slidesToShow: 10,
								slidesToScroll: 5,
								dots: false,
								arrows: false,
								infinite: false,
								autoplay: false,
								speed: 800,
								asNavFor: $slider,
								focusOnSelect: true,
								responsive: [
									{
										breakpoint: 1100,
										slidesToShow: 9,
										slidesToScroll: 5
									}
								]
							});

						})($slider, $nav);
					});
				}
			},


			order: {
				$order: null,

				init: function() {
					var self = this;

					self.$order = $(".order", self.$page);

					self.delivery();

					self.basket();

					if(window.ymaps && window.ymaps !== undefined) {
						ymaps.ready(function() {
							self.maps.init();
						});
					}
				},

				delivery: function() {
					var self = this;

					$(".order-delivery-item-radio:checked", self.$order).closest(".order-delivery-item").addClass("active");

					$(".order-delivery-item-radio", self.$order).on("change", function() {
						setTimeout(function() {
							jcf.destroyAll(self.$order.find(".delivery-tab.active"));
							jcf.replaceAll(self.$order.find(".delivery-tab.active"));
						}, 200);
	        			setTimeout(function() {
							self.$order.find(".delivery-tab.active .delivery-map-select-item").each(function() {
								var $ditem = $(this);
								$ditem.data("offsetTop", $ditem.position().top);
							});
	        			}, 250);
					});

        			setTimeout(function() {
						self.$order.find(".delivery-tab.active .delivery-map-select-item").each(function() {
							var $ditem = $(this);
							$ditem.data("offsetTop", $ditem.position().top);
						});
        			}, 250);


					$(".order-delivery-mobile-item .form-item--radio", $sel.page).on("change", function() {
						$(".order-delivery-mobile-item", $sel.page).removeClass("active");
						$(this).closest(".order-delivery-mobile-item").addClass("active");
					});
				},

				basket: function() {
					$(".basket-item-remove", $sel.page).on("click", function(e) {
						e.preventDefault();
						var $holder = $(this).closest(".basket-item").slideUp();
					});
				},

				maps: {
					placemarkIconGray: {
			        	iconLayout: "default#image",
			        	iconImageHref: "../i/map_icon.png",
			        	iconImageSize: [40, 40],
			        	iconImageOffset: [-20, -40]
			        },
					placemarkIconBlue: {
			        	iconLayout: "default#image",
			        	iconImageHref: "../i/map_icon_active.png",
			        	iconImageSize: [54, 54],
			        	iconImageOffset: [-27, -54]
			        },
			        placemarkIconPost: {
			        	preset: "islands#icon",
			        	iconColor: "#153B6E",
			        },
			        placemarkIconPostActive: {
			        	preset: "islands#icon",
			        	iconColor: "#E9534E",
			        },
					init: function() {
						var self = this,
							isMobile = $sel.window.width() < 1000 ? true : false;

						$(".delivery-map-yandex", $sel.page).each(function() {
							(function($map) {
								var yMap = false,
									info = $map.data("info"),
									$holder = $map.closest(".delivery-map"),
									$title = $holder.find(".delivery-map-selected"),
									$titleMobile = $($map.data("mobiletitle")),
									isCluster = info.cluster;
								
								yMap = new ymaps.Map($map[0], {
			            			center: eval(info.center), 
			            			zoom: info.zoom
			        			});
			        			yMap.behaviors.disable("scrollZoom");
			        			yMap.controls.remove("trafficControl").remove("scaleLine").remove("typeSelector").remove("searchControl");



			        			if(!isCluster) {
			        				var yPoints = new ymaps.GeoObjectCollection(null, {});
			        			} else {
			        				var yPoints = new ymaps.Clusterer(null, {});
			        			}

			        			for(var i = 0; i < info.points.length; i++) {
			        				var point = info.points[i];
				        			yPoints.add(new ymaps.Placemark(
					        			eval(point.coords),
					        			{
					        				id: point.id,
					        				title: point.title,
					        				balloonContent: isMobile ? '<div class="map-baloon page-text page-text--small">' + point.balloon + '<p>&nbsp;</p><span class="delivery-point-btn btn btn--small btn--black" data-point="' + point.id + '">Выбрать</span>' + '</div>' : ''
					        			},
					        			(isCluster ? self.placemarkIconPost : self.placemarkIconGray)
					        		));
			        			}

			        			yMap.geoObjects.add(yPoints);


			        			
			        			if(isMobile) {
			        				$sel.body.on("click", ".delivery-point-btn", function() {
			        					handlePointClick($(this).data("point"));
			        				});
			        			} else {
				        			yPoints.events.add("click", function(e) {
				        				var placemark = e.get("target");
				        				handlePointClick(placemark.properties.get("id"));
				        			});
			        			}



			        			function handlePointClick(pointId) {
			        				var $radio = $(".delivery-map-select-item-radio[value='" + pointId + "']", $holder);

			        				if(!$radio.length) {
			        					return false;
			        				}

			        				var $radioLabel = $radio.closest(".delivery-map-select-item");
			        					radioTop = $radioLabel.data("offsetTop");
			        				
			        				console.log(radioTop);
			        				$radio.trigger("click");

			        				if(!$radioLabel.hasClass("jcf-label-active")) {
			        					$holder.find(".jcf-scrollable").scrollTop(radioTop);
			        					jcf.refresh($holder);			        					
			        				}
			        				
			        				$.magnificPopup.close();
			        			}
			        			$(".delivery-map-select-item-radio", $holder).on("change", function() {
			        				setPoint($(this).val());
			        			});
								function setPoint(pointId) {
									$title.hide();
									$titleMobile.hide();

									if(isCluster) {
										var yPointsList = yPoints.getGeoObjects();
										for(var i = 0; i < yPointsList.length; i++) {
											setPointState(yPointsList[i], pointId);
										}
									} else {
										yPoints.each(function(p) {
											setPointState(p, pointId);
										});
									}
								}
								function setPointState(p, pointId) {
									if(p.properties.get("id") == pointId) {
										$title.show().find("span").html(p.properties.get("title"));
										$titleMobile.show().find("span").html(p.properties.get("title"));
										p.options.set((isCluster ? self.placemarkIconPostActive : self.placemarkIconBlue));
									} else {
										p.options.set((isCluster ? self.placemarkIconPost : self.placemarkIconGray));
									}
								} 

							})($(this));
						});


					}
				}
			},


			filter: {
				$filter: null,
				$tabs: null,
				$content: null,
				$headings: null,

				$currentHeading: null,
				$currenTab: null,

				brands: {
					itemWidth: 250,
					rowsCount: 7
				},

				all: {
					itemWidth: 250,
					rowsCount: 7,
					minItems: 21
				},

				init: function() {
					var self = this;

					self.$filter = $(".filter", $sel.page);
					self.$headings = $(".filter-heading-item", self.$filter);
					self.$content = $(".filter-content", $sel.page);
					self.$tabs = $(".filter-content-item", self.$page);

					self.tabs();

					self.price();

					self.handle();

					$(".page-heading-filter-item", $sel.page).on("click", function(e) {
						e.preventDefault();
						
						var $item = $(this);

						if($item.hasClass("page-heading-filter-item--clear")) {
							$item.siblings().fadeOut(250);
						}
						$item.fadeOut(300);
						
					});
				},

				tabs: function() {
					var self = this;

					self.$headings.on("click", function(e) {
						e.stopPropagation();

						var $heading = $(this),
							$tab = self.$tabs.filter($heading.data("filter"));

						// Заголовки фильтра
						self.$headings.removeClass("active");
						$heading.addClass("active");
						self.$currentHeading = $heading;

						// Содержимое таба
						self.$currenTab = $tab;

						// Обработка случая брендов
						if(self.$currenTab.hasClass("filter-content-item--brands") && !self.$currenTab.hasClass("make")) {
							setBrandsFilter();
						}

						// Обработка случая других фильтров
						if(self.$currenTab.hasClass("filter-content-item--all") && !self.$currenTab.hasClass("make")) {
							setAllFilter();
						}

						// Показ таба
						self.$tabs.removeClass("active");
						self.$currenTab.css("left", (self.$currenTab.hasClass("filter-content-item--fullwidth") ? 0 : $heading.offset().left)).addClass("active");
					});


					// Обработка сторонних кликов
					self.$tabs.on("click", function(e) {
						e.stopPropagation();
					});
					$sel.window.on("click", function() {
						if(self.$currentHeading && self.$currenTab) {
							self.$currentHeading.removeClass("active");
							self.$currenTab.removeClass("active");
						}
					});


					// Формирование фильтра брендов
					function setBrandsFilter() {
						var $rows = self.$currenTab.find(".brands-indexes-rows"),
							$items = $rows.find(".brands-index-row-items");
						$items.each(function() {
							var $item = $(this),
								$itemRows = $item.find(".filter-row"),
								itemColsCount = Math.ceil($itemRows.length / self.brands.rowsCount),
								itemWidth = parseInt(itemColsCount * self.brands.itemWidth);
							$item.css({
								"column-count": itemColsCount,
								"width": itemWidth
							});
						});

						var $scroll = self.$currenTab.find(".brands-indexes-scroll");
						if($scroll.data("scroll")) {
							$scroll.data("scroll").recalculate();
						} else {
							$scroll.data("scroll", new SimpleBar($scroll[0], {
								autoHide: false
							}));
						}

						$(".brands-letters-item", self.$currenTab).on("click", function(e) {
							e.preventDefault();

							var $block = self.$currenTab.find(".brands-index-row[data-letter='" + $(this).data("letter") + "']");
							$scroll.data("scroll").getScrollElement().scrollTo($block.position().left, 0);
							$block.addClass("blink");
							setTimeout(function() {
								$block.removeClass("blink");
							}, 1500);
						});

						// Флаг инициализации фильтра
						self.$currenTab.addClass("make");
					}


					// Формирование фильтра "Другие"
					function setAllFilter() {
						var $innerTabs = self.$currenTab.find(".filter-inner-tabs");
						
						// Скролл для списка внутренних табов
						new SimpleBar($innerTabs.find(".scrollable-tabs")[0], {
							autoHide: false
						});

						// Клик по внутреннему табу
						$(".filter-inner-tab-item", self.$currenTab).on("click", function() {
							$(".filter-inner-tab-item", self.$currenTab).removeClass("active");
							$(".filter-inner-content-item", self.$currenTab).removeClass("active");

							var $item = $(this);
							$item.addClass("active");
							$($item.data("innertab")).addClass("active");
							makeScroll();
						});

						makeScroll();

						// Скролл для контента внутренних табов
						function makeScroll() {
							var $content = self.$currenTab.find(".filter-inner-content-item.active");
							if(!$content.data("scroll")) {
								var $rowsHolder = $content.find(".filter-rows"),
									$rows = $rowsHolder.find(".filter-row");
								if($rows.length <= self.all.minItems) {
									$content.data("scroll", "no");
								} else {
									var columnCount = Math.ceil($rows.length / self.all.rowsCount);
									$rowsHolder.css({
										"width": (columnCount * self.all.itemWidth),
										"column-count": columnCount
									});
									$content.data("scroll", new SimpleBar($content.find(".scrollable-content")[0], {
										autoHide: false
									}));
								}

							} else if($content.data("scroll") != "no") {
								$content.data("scroll").recalculate();
							}
						}

						// Флаг инициализации фильтра
						self.$currenTab.addClass("make");
					}

				},

				handle: function() {
					var self = this;

					$("input:checkbox", self.$content).on("change", function() {
						var $holder = $(this).closest(".filter-content-item"),
							$heading = self.$headings.filter("[data-filter='#" + $holder.attr("id") + "']");
						if($holder.find("input:checked").length) {
							$heading.addClass("selected");
						} else {
							$heading.removeClass("selected");
						}
					});

					$(".form-item--range", self.$content).on("change input", function(e, u) {
						var $holder = $(this).closest(".filter-content-item"),
							$heading = self.$headings.filter("[data-filter='#" + $holder.attr("id") + "']"),
							$range = $(this);
						//console.log($range[0].valueLow + "," + $range[0].valueHigh, $range.data("value"));
						if($range[0].valueLow + "," + $range[0].valueHigh != $range.data("value")) {
							$heading.addClass("selected");
						} else {
							$heading.removeClass("selected");
						}
					});
				},

				price: function() {
					var self = this;

					$(".filter-price", $sel.filter).each(function() {
						(function($priceFilter) {
							$(".form-item--range", $priceFilter).on("change input", function(e, u) {
								syncPriceFilter("slider", $priceFilter);
							});
							$(".filter-price-field", $priceFilter).on("change", function() {
								syncPriceFilter("field", $priceFilter);
							});

							syncPriceFilter("field", $priceFilter);
						})($(this));
					});

					function syncPriceFilter(source, $priceFilter) {
						var $from = $(".filter-price-field--from", $priceFilter),
							$to = $(".filter-price-field--to", $priceFilter),
							$range = $(".form-item--range", $priceFilter),
							rangeMin = parseInt($range.attr("min")),
							rangeMax = parseInt($range.attr("max")),
							fromVal, toVal;
						
						if(source == "slider") {
							fromVal = $range[0].valueLow,
							toVal = $range[0].valueHigh;
						} else if(source == "field") {
							fromVal = $from.val().replace(/ /g, ""),
							toVal = $to.val().replace(/ /g, "");
							
							if(fromVal >= rangeMax || fromVal <= rangeMin) {
								fromVal = rangeMin;
							}

							if(toVal >= rangeMax || toVal <= rangeMin) {
								toVal = rangeMax;
							}
							
							var inst = jcf.getInstance($range);
							if(inst) {
								inst.values = [fromVal, toVal];
								inst.refresh();									
							}
						}

						$from.val(formatValue(fromVal));
						$to.val(formatValue(toVal));
					}

					function formatValue(value) {
						var strValue = value.toString(),
							formatStrValue = [];
						for(var len = strValue.length, i = len, j = 0; i >= 0; i--) {
							formatStrValue.push(strValue[i]);
							if(j == 3) {
								formatStrValue.push(' ');
								j = 0;
							}
							j++;
						}
						return formatStrValue.reverse().join("");
					}
				}
			},




			catalog: {

				init: function() {
					var self = this;

					self.slider();
					self.list();
					self.lettering();
					self.product();
					self.sorter();
				},

				sorter: function() {
					$(".catalog-toolbar-sorter", $sel.page).on("click", function(e) {
						e.stopPropagation();
						$(this).toggleClass("active");
					});
					$sel.window.on("click", function() {
						$(".catalog-toolbar-sorter", $sel.page).removeClass("active");
					});
				},

				lettering: function() {
					$(".catalog-cta-rounded, .shop-video-rounded", $sel.page).lettering();
				},

				list: function() {
					var catZ = 100;
					$(".catalog", $sel.page).each(function() {
						$(this).css("z-index", catZ);
						catZ -= 10;
					});

					$sel.body.on("mouseenter", ".catalog-item", function() {
						var $item = $(this);
						setTimeout(function() {
							$item.addClass("show");
							if($item.hasClass("catalog-item--inline")) {
								$item.find(".catalog-item-content .catalog-item-photo-holder").slideDown();
							}
						}, 50);
					});
					$sel.body.on("mouseleave", ".catalog-item", function() {
						var $item = $(this);
						$item.removeClass("show");
					});
				
					$(".product-buy", $sel.page).on("click", function(e) {
						e.preventDefault();

						var destForm = "#buy-form";
						if($(".product", $sel.body).length && $(".product .product-mods-items").length && !$(".product .product-mod-item input[name='product_mod']:checked").length) {
							destForm = "#size-form";
						}

						$.magnificPopup.open({
							mainClass: "mfp-fade",
							removalDelay: 300,
							tClose: "Закрыть (ESC)",
							tLoading: "Загрузка...",
							items: {
								src: destForm,
								type: "inline"
							}
						});

					});

					$(".ring-buy", $sel.page).on("click", function(e) {
						e.preventDefault();

						$.magnificPopup.open({
							mainClass: "mfp-fade",
							removalDelay: 300,
							tClose: "Закрыть (ESC)",
							tLoading: "Загрузка...",
							items: {
								src: "#size-form",
								type: "inline"
							}
						});
					});

					
				},

				slider: function() {
					
					
					$(".product-linked-products").slick({
						slidesToShow: 2.3,
						slidesToScroll: 2,
						arrows: false,
						speed: 200,
						infinite: false,
						arrows: false,
						dots: false,
						mobileFirst: true,
						responsive: [
							{
								breakpoint: 768,
								settings: "unslick"
							}
						]
					});
					
					
					
					$(".catalog-items--slider", $sel.page).each(function() {
						var $s = $(this),
							$h = $s.closest(".catalog"),
							$prevArr = $h.find(".catalog-heading-nav--prev"),
							$nextArr = $h.find(".catalog-heading-nav--next");
						$s.slick({
							slidesToShow: ($s.closest(".catalog").hasClass("catalog--viewed") ? 5 : 4),
							slidesToScroll: 2,
							dots: false,
							arrows: true,
							infinite: false,
							autoplay: false,
							//autoplaySpeed: 5000,
							speed: 500,
							prevArrow: $prevArr,
							nextArrow: $nextArr,
							//swipeToSlide: true,
							//waitForAnimate: false,
							responsive: [
								{
									breakpoint: 1000,
									settings: {
										slidesToShow: 2.3,
										slidesToScroll: 2,
										arrows: false,
										speed: 200
										//swipeToSlide: true
									}
								}
							]
						});
					});
					
					$(".catalog-items--slider-tagHeuer", $sel.page).each(function() {
						var $s = $(this),
							$h = $s.closest(".catalog"),
							$prevArr = $h.find(".catalog-heading-nav--prev"),
							$nextArr = $h.find(".catalog-heading-nav--next");
						$s.slick({
							slidesToShow:  3,
							slidesToScroll: 2,
							dots: false,
							arrows: true,
							infinite: false,
							autoplay: false,
							//autoplaySpeed: 5000,
							speed: 500,
							prevArrow: $prevArr,
							nextArrow: $nextArr,
							//swipeToSlide: true,
							//waitForAnimate: false,
							responsive: [
								{
									breakpoint: 1000,
									settings: {
										slidesToShow: 2.3,
										slidesToScroll: 2,
										arrows: false,
										speed: 200
										//swipeToSlide: true
									}
								}
							]
						});
					});

					$(".slider-items", $sel.page).slick({
						slidesToShow: 1,
						slidesToScroll: 1,
						dots: true,
						arrows: false,
						//autoplay: true,
						//autoplaySpeed: 5000,
						speed: 800
					});
				},

				product: function() {
					var $holder = $(".product", $sel.page);

					$(".product .product-photos-items").slick({
						slidesToShow: 1,
						slidesToScroll: 1,
						dots: false,
						arrows: false,
						infinite: false,
						autoplay: false,
						speed: 800,
						asNavFor: ".product .product-photos-nav-items",
						responsive: [
							{
								breakpoint: "1000",
								settings: {
									dots: true
								}
							}
						]
					});

					$(".product .product-photos-nav-items").slick({
						slidesToShow: 4,
						slidesToScroll: ($(".product .product-photos-nav-items > div").length <= 4 ? 4 : 1),
						dots: false,
						arrows: true,
						infinite: false,
						autoplay: false,
						speed: 800,
						prevArrow: $("#product-photos-nav-arrow--prev", $sel.page),
						nextArrow: $("#product-photos-nav-arrow--next", $sel.page),
						asNavFor: ".product .product-photos-items",
						focusOnSelect: true,
						vertical: true,
						verticalSwiping: true
					});


					$(".product-mods-items", $sel.body).each(function() {
						(function($items) {
							$(".product-mod-item input:checkbox", $items).on("change", function() {
								$(".product-mod-item", $items).removeClass("active");
								$(this).closest(".product-mod-item").addClass("active");
							});
						})($(this));
					});


				
					$(".product-stars", $holder).each(function() {
						var $s = $(this);
						
						$s.starRating($.extend({
							basicImage: "../svg/star_grey.svg",
							ratedImage: "../svg/star_black.svg",
							hoverImage: "../svg/star_active.svg"
						}, $s.data("params")));
					});


					$(".product-photos", $holder).on("click", function() {
						$.magnificPopup.open({
							mainClass: "mfp-fade",
							removalDelay: 300,
							tClose: "Закрыть (ESC)",
							tLoading: "Загрузка...",
							items: {
								src: "#product-gallery",
								type: "inline"
							},
							closeOnBgClick: false,
							callbacks: {
								open: function() {
									var $holder = $(this.container);

									if(!$holder.data("activated")) {
										$(".product-photos-items", $holder).slick({
											slidesToShow: 1,
											slidesToScroll: 1,
											dots: false,
											arrows: true,
											infinite: false,
											autoplay: false,
											speed: 800,
											asNavFor: $(".product-photos-nav-items", $holder),
											responsive: [
												{
													breakpoint: "1000",
													settings: {
														arrows: false
													}
												}
											]
										});

										$(".product-photos-nav-items", $holder).slick({
											slidesToShow: 9,
											slidesToScroll: 8,
											dots: false,
											arrows: false,
											infinite: false,
											autoplay: false,
											speed: 800,
											asNavFor: $(".product-photos-items", $holder),
											focusOnSelect: true,
											responsive: [
												{
													breakpoint: "1000",
													settings: {
														slidesToShow: 2,
														slidesToScroll: 2,
														focusOnSelect: false
													}
												}
											]
										});

										$holder.data("activated", true);	
									} else {
										$(".product-photos-items", $holder).slick("refresh");
										$(".product-photos-nav-items", $holder).slick("refresh");
									}

								}
							}
						});
					});



					//if($sel.window.width() > 990) {
						$(".product-discount", $holder).on("click", function() {
							return false;
						});
					//}




					$(".reviews-show-all", $sel.page).on("click", function(e) {
						$(".review-item.hide", $sel.page).removeClass("hide");
						setTimeout(function() {
							$(".review-item", $sel.page).addClass("show");
						}, 50);
						$(this).remove();
						e.preventDefault();
					});

					$(".article-show-all", $sel.page).on("click", function(e) {
						$(".article-item.hide", $sel.page).removeClass("hide");
						setTimeout(function() {
							$(".article-item", $sel.page).addClass("show");
						}, 50);
						$(this).remove();
						e.preventDefault();
					});

					$(".show-more-tags", $sel.page).on("click", function(e) {
						$(".sections-list__item.hide-sm-up", $sel.page).removeClass("hide-sm-up");
						setTimeout(function() {
							$(".sections-list__item", $sel.page).addClass("show-sm-up");
						}, 50);
						$(this).remove();
						e.preventDefault();
					});

					$(".show-more-tags", $sel.page).on("click", function(e) {
						$(".sections-list__item.hide-sm", $sel.page).removeClass("hide-sm");
						setTimeout(function() {
							$(".sections-list__item", $sel.page).addClass("show-sm");
						}, 50);
						$(this).remove();
						e.preventDefault();
					});

					


				


					$(".review-item-photos-items", $sel.page).each(function() {
						var $items = $(this);
						
						$(".review-item-photo", $items).magnificPopup({
							mainClass: "mfp-fade",
							removalDelay: 300,
							tClose: "Закрыть (ESC)",
							tLoading: "Загрузка...",
							type: "image",
							gallery: {
								enabled: true,
								tCounter: "",
							}
						});
					});




				}

			},


			search: {
				$form: null,
				$search: null,

				$history: null,
				$results: null,
				$popularItems: null,
				$brandsItems: null,
				$sectionsItems: null,

				init: function() {
					var self = this;

					self.$form = $(".header-search", $sel.page);
					self.$search = $(".search", self.$form);

					self.$history = $(".search-history", $sel.page);
					self.$results = $(".search-results", $sel.page);
					self.$popularItems = $(".search-popular-items", $sel.page);
					self.$brandsItems = $(".search-brands-items", $sel.page);
					self.$sectionsItems = $(".search-sections-items", $sel.page);

					$(".header-search-input", self.$form).on("focus", function() {
						self.$form.addClass("show");
						self.showContent();
					});

					$(".header-search-input", self.$form).on("blur", function() {
						setTimeout(function() {
							self.$form.removeClass("show");
							self.hideContent();
						}, 200);
					});

					self.autocomplete();
				},

				showContent: function() {
					var self = this;

					self.$search.css("display", "block");
					setTimeout(function() {
						self.$search.addClass("show");
					}, 50);
				},

				hideContent: function() {
					var self = this;

					self.$search.removeClass("show");
					setTimeout(function() {
						self.$search.css("display", "none");
					}, 50);
				},

				autocomplete: function() {
					var self = this;

					$("#header-search-input, #mobile-search-form-input", $sel.page).autocomplete({
						minChars: 1,
						serviceUrl: "/pages/search.json",
						dataType: "json",
						formatResult: function(suggestion, currentValue) {
							var strItem = '',
								itemName = suggestion.value.replace(new RegExp(ALLTIME.utils.escapeRegExp(currentValue), 'gi'), "<strong>" + currentValue + "</strong>");

							switch(suggestion.data.category) {
								case "main":
									strItem += '<div class="search-result-item-holder">' +
										'<a href="' + suggestion.data.url + '" class="search-result-item link link--gray_border_inverse"><span>' + itemName + '</span></a>' + 
									'</div>';
								break;

								case "popular":
									strItem += '<a href="' + suggestion.data.url + '" class="search-popular-item">' + 
										'<div class="search-popular-item-photo-holder">' +
											'<img src="' + suggestion.data.photo + '" class="img-resize" />' + 
										'</div>' + 
										'<div class="search-popular-item-content">' + 
											'<div class="search-popular-item-title">' + itemName + '</div>' + 
											'<div class="search-popular-item-price">' + suggestion.data.price + '</div>' + 
										'</div>' + 
									'</div>';
								break;

								case "brands":
									strItem += '<div class="search-brand-item-holder">' + 
										'<a href="' + suggestion.data.url + '" class="search-brand-item link link--black_border_inverse"><span>' + itemName + '</span></a>' + 
									'</div>';
								break;

								case "cat":
									strItem += '<div class="search-section-item-holder">' + 
										'<a href="' + suggestion.data.url + '" class="search-section-item link link--black_border_inverse"><span>' + itemName + '</span></a>' + 
									'</div>';
								break;
							}
					
							return strItem;
						},
						beforeRender: function($container) {
							var $result = $('<div />').append($container.html());
							$container.addClass("empty").empty();


							self.$history.hide();
							self.$results.show();
							self.$results.find(".search-results-items").empty().append($result.find(".search-result-item-holder"));
							
							self.$popularItems.find(".default").hide();
							self.$popularItems.find(":not(.default)").remove();
							self.$popularItems.append($result.find(".search-popular-item"));

							self.$brandsItems.find(".default").hide();
							self.$brandsItems.find(":not(.default)").remove();
							self.$brandsItems.append($result.find(".search-brand-item-holder"));

							self.$sectionsItems.find(".default").hide();
							self.$sectionsItems.find(":not(.default)").remove();
							self.$sectionsItems.append($result.find(".search-section-item-holder"));							
						},
						onSelect: function(suggestion) {
							console.log(suggestion);
							if(suggestion.data.url) {
								window.location.href = suggestion.data.url;
							}
						}
					});
					/*$("#header-search-input", $sel.page).on("keyup", function() {
						if($(this).val() == "") {
							self.$history.show();
							self.$results.hide();
						} else {
							self.$history.hide();
							self.$results.show();
						}
					});*/
				}

			},


			navigation: {
				$menu: null,
				$holder: null,
				$currentItem: null,
				$currentNav: null,

				showTimer: false,
				hideTimer: false,

				init: function() {
					var self = this;

					self.$holder = $("#header-nav", $sel.page);
					self.$menu = $(".header-menu", $sel.page);

					$(".header-menu-item", $sel.page).on("mouseenter", function() {
						var $link = $(this);
						clearTimeout(self.showTimer);
						clearTimeout(self.hideTimer);
						self.showTimer = setTimeout(function() {
							if($link.data("nav")) {
								clearTimeout(self.hideTimer);
								self.show($link, $($link.data("nav")));
							} else {
								self.hide();
							}
						}, 150);
					});
					self.$menu.on("mouseleave", function() {
						clearTimeout(self.showTimer);
						self.hideTimer = setTimeout(function() {
							self.hide();
						}, 350);
					});

					self.$holder.on("mouseenter", function() {
						clearTimeout(self.hideTimer);
					});
					self.$holder.on("mouseleave", function() {
						self.hideTimer = setTimeout(function() {
							self.hide();
						}, 350);
					});

				},

				show: function($item, $menu) {
					var self = this;

					if(self.$currentItem && self.$currentItem.data("nav") == $item.data("nav")) {
						return false;
					}

					if(self.$currentItem) {
						self.$currentItem.removeClass("active");
					}
					if(self.$currentNav) {
						self.$currentNav.removeClass("show").addClass("removed");
						$menu.css("display", "block");
						(function($nav) {
							setTimeout(function() {
								$nav.css("display", "none").removeClass("removed");
							}, 300);
						})(self.$currentNav);
					}

					$item.addClass("active");

					self.$holder.css("display", "block");
					setTimeout(function() {
						self.$holder.addClass("show");
						$menu.css("display", "block");
						setTimeout(function() {
							$menu.addClass("show");
						}, 50);
					}, 50);

					self.$currentItem = $item;
					self.$currentNav = $menu;
				},

				hide: function() {
					var self = this;

					if(!self.$currentItem) {
						return false;
					}

					self.$currentItem.removeClass("active");
					self.$currentNav.removeClass("show").addClass("removed-all");
					(function($nav) {
						setTimeout(function() {
							$nav.css("display", "none").removeClass("removed-all");
							self.$holder.removeClass("show");
							setTimeout(function() {
								self.$holder.css("display", "none");
							}, 250);
						}, 220);
					})(self.$currentNav);

					self.$currentItem = null;
					self.$currentNav = null;
				}

			},


			common: {
				go: function(topPos, speed, callback) {
					var curTopPos = $sel.window.scrollTop(),
						diffTopPos = Math.abs(topPos - curTopPos);
					$sel.body.add($sel.html).animate({
						"scrollTop": topPos
					}, speed, function() {
						if(callback) {
							callback();
						}
					});
				},

				window: {
					init: function() {
						$sel.window.on("scroll", function() {
							setTimeout(function() {
								($sel.window.scrollTop() > 100) ? $sel.body.addClass("after-scroll") : $sel.body.removeClass("after-scroll");
							}, 100);
						});
					}
				}
			},

			action: {
				COOKIE_NAME: "TOP_ACTION",
				$block: false,
				$blockClose: false,
				blockID: false,
				init: function() {
					var self = this;

					self.$block = $(".page-action", $sel.body);
					if(!self.$block || !self.$block.length) {
						return false;
					}
					self.$blockClose = $(".page-action-close", self.$block);
					self.blockID = self.$block.data("id");

					$sel.window.on("load", function() {
						setTimeout(function() {
							self.show(self.blockID);
						}, 1000);
					});
					self.$blockClose.on("click", function(e) {
						self.hide(self.blockID);
						e.preventDefault();
					});
				},
				show: function(blockID) {
					var self = this;
					if(Cookies.get(self.COOKIE_NAME + "_" + blockID)) {
						return false;
					}
					$sel.body.addClass("show-action");
					self.$block.addClass("page-action--show");
				},
				hide: function(blockID) {
					var self = this;
					$sel.body.removeClass("show-action");
					self.$block.removeClass("page-action--show");
					Cookies.set(self.COOKIE_NAME + "_" + blockID, "Y", {
						expires: 7
					});
				}
			},

			tabs: {
				init: function() {
					var self = this;

					$sel.body.on("click", "[data-tab]", function(e) {
						//e.preventDefault();

						var $tabItem = $(this);
						if($tabItem.hasClass("active")) {
							return false;
						}

						var $tabItems = $("[data-tabs='" + $tabItem.data("tabs") + "']", $sel.body),
							$tabContent = $($(this).data("tab"), $sel.body),
							$tabs = $($tabItem.data("tabs"), $sel.body);

						$tabItems.removeClass("active");
						$tabItem.addClass("active");

						var $activeTab = $tabs.filter(".active");
						$activeTab.removeClass("show").addClass("remove");
						setTimeout(function() {
							$activeTab.removeClass("active remove");
						}, 550);

						$tabContent.addClass("active");
						setTimeout(function() {
							$tabContent.addClass("show");
						}, 50);
						
					});
				}
			},

			toggle: {
				init: function() {
					$("[data-toggle]", $sel.page).on("click", function(e) {
						e.preventDefault();

						var $link = $(this),
							$content = $link.closest(".has-toggle").find(".toggle-content");

						$link.remove();
						$content.css("display", "block");
						setTimeout(function() {
							$content.addClass("show");
						}, 50);
					});
				}
			},

			accordion: {
				$opened: false,
				init: function() {
					var self = this;
					$(".accordion-item-heading").on("click", function() {
						var $item = $(this).closest(".accordion-item");
						if($item.hasClass("opened")) {
							self.hide($item);
							return false;
						}
						if(self.$opened) {
							self.hide(self.$opened);
						}
						self.show($item);

						setTimeout(function() {
							ALLTIME.common.go($item.offset().top - 100, 500);
						}, 350);
					});
				},
				show: function($item) {
					var self = this, 
						$content = $item.find(".accordion-item-content");
					$item.addClass("opened");
					$content.css("display", "block");
					(function($content) {
						setTimeout(function() {
							$content.addClass("show")
						}, 50);
					})($content);
					self.$opened = $item;


				},
				hide: function($item) {
					var self = this, 
						$content = $item.find(".accordion-item-content");
					$item.removeClass("opened");
					$content.removeClass("show");
					(function($content) {
						setTimeout(function() {
							$content.css("display", "none");
						}, 350);
					})($content);

					self.$opened = false;
				}
			},

			brands: {
				init: function() {
					var self = this;

					self.logos();
					self.letters();
				},

				logos: function() {
					$(".logos-items[data-slider]", $sel.page).each(function() {
						var $s = $(this),
							params = $s.data("slider"),
							$h = $s.closest(".page-section"),
							$prevArr = $h.find(".catalog-heading-nav--prev"),
							$nextArr = $h.find(".catalog-heading-nav--next");
						$s.slick($.extend({
							slidesToShow: 5,
							slidesToScroll: 3,
							dots: true,
							arrows: true,
							infinite: false,
							autoplay: true,
							autoplaySpeed: 5000,
							speed: 1600,
							prevArrow: $prevArr ? $prevArr : null,
							nextArrow: $nextArr ? $nextArr : null,
							responsive: [
								{
									breakpoint: 3000,
									settings: {
										slidesToShow: 7,
										slidesToScroll: 6,
										speed: 1000,
									}
								}, {
									breakpoint: 1024,
									settings: {
										slidesToShow: 3,
										slidesToScroll: 3,
										arrows: false,
										dots: false,
										speed: 500,
										prevArrow: false,
										nextArrow: false
									}
								}, {
									breakpoint: 550,
									settings: {
										slidesToShow: 2.2,
										slidesToScroll: 2,
										arrows: false,
										dots: false,
										speed: 200
									}
								}
							]
						}, params));
					});
				},

				letters: function() {
					$(".brands-letters-item:not(.brands-letters-item--filter)", $sel.page).on("click", function(e) {
						var $l = $(this);

						if($l.data("letter")) {
							e.preventDefault();

							var $b = $(".brands-index-row[data-letter='" + $l.data("letter") + "']");
							$b.addClass("blink");
							ALLTIME.common.go($b.offset().top, 300, function() {
								setTimeout(function() {
									$b.removeClass("blink");
								}, 1500);
							});
						}
					});
				}
			},

			pager: {
				init: function() {
					$sel.page.on("click", ".load-more", function(e) {
						var $link = $(this);
						(function($link, href, $container, selector, callback) {
							$link.addClass("loading");
							$.ajax({
								url: href,
								data: {
									"IS_AJAX": "Y"
								},
								success: function(data) {
									var $data = $('<div />').append(data),
										$items = $data.find(selector),
										$preloader = $data.find(".btn-holder");

									//$items.addClass("loaded-item loaded-item--hidden");
									$link.closest(".btn-holder").remove();

									$container.append($items);
									if($preloader && $preloader.length) {
										$container.append($preloader);
									}
									/*setTimeout(function() {
										$container.find(".loaded-item--hidden").removeClass("loaded-item--hidden").addClass("loaded-item--visible");
									}, 50);*/

									ALLTIME.animation.wow.prepare();
									ALLTIME.animation.wow.check(false, true);

								}
							});
						})($link, $link.attr("href"), $($link.data("container")), $link.data("itemsselector"))

						e.preventDefault();
					});
				}
			},



			forms: {
				init: function() {
					var self = this;

					self.customize();
					self.validation();

					self.captcha.init();
				},

				captcha: {
					loaded: false,
					init: function() {
						var self = this;

						$(".form-captcha-reload", $sel.page).on("click", function() {
							var $reload = $(this),
								$holder = $(this).closest(".form-captcha"),
								$img = $holder.find("img");

							self.reload($reload.data("href"), $img);
						});
					},

					reload: function(captchaUrl, $img) {
						var self = this;

						if(self.loaded) {
							return false;
						}

						$.ajax({
							url: captchaUrl,
							dataType: "json",
							complete: function() {
								self.loaded = false;
							},
							success: function(data) {
								$img.attr("src", data.img);
							}
						});
					}
				},

				customize: function($container) {
					if(!$container) {
						$container = $sel.page;
					}

					jcf.replace($(".form-item--number", $container));

					jcf.replace($(".form-item--checkbox", $container));

					jcf.replace($(".form-item--radio", $container));

					jcf.replace($(".form-item--range", $container));

					jcf.replace($(".form-item--number", $container));

					jcf.replace($(".jcf-scrollable", $container));


					$(".form-item--file", $container).each(function() {
						(function($file) {
							var $holder = $file.closest(".form-file-holder"),
								$items = $holder.find(".form-file-items");
							$file.fileupload({
								dataType: "json",
								done: function (e, data) {
									var $files = "";
									console.log(data);
									$.each(data.result.files, function(index, file) {
										$files += '<div class="form-file-item"><div class="form-file-item-title">' + file.name + '</div></div>'
									});
									$items.empty().append($files);
								}
							});
						})($(this));

					});

					// Select
					jcf.setOptions("Select", {
						wrapNative: false,
						wrapNativeOnMobile: false,
						maxVisibleItems: 6
					});
					$(".form-item--select", $container).each(function() {
						var $select = $(this);
						
						if($select.attr("placeholder")) {
							$select.prepend('<option class="hideme" selected>' + $select.attr("placeholder") + '</option>');
						}
						jcf.replace($select);
					});

					$(".password-show", $container).on("click", function(e) {
						e.preventDefault();

						var $toggle = $(this),
							$field = $toggle.closest(".form-item-holder").find("input");

						$toggle.toggleClass("show");
						$toggle.hasClass("show") ? $field.attr("type", "text") : $field.attr("type", "password");
					});


					$(".form-item--autocomplete", $container).each(function() {
						var $item = $(this),
							params = $item.data("autocomplete");
						
						//console.log(params.href);
						
						$item.autocomplete({
							minChars: 1,
							serviceUrl: params.href,
							dataType: "json",
							formatResult: function(suggestion, currentValue) {
								var strItem = '',
									itemName = suggestion.value.replace(new RegExp(ALLTIME.utils.escapeRegExp(currentValue), 'g'), "<b>" + currentValue + "</b>");	
								strItem += '<div class="autocomplete-item">' + itemName + '</div>';
								return strItem;
							}
						});
					});


				},

				validation: function($container) {
					if(!$container) {
						$container = $sel.body;
					}

					$.validator.addMethod("phoneRU", function(phone_number, element) {
						phone_number = phone_number.replace(/\(|\)|\s+|-/g, "");
						return this.optional(element) || phone_number.length > 5 && phone_number.match(/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{6,10}$/);
					}, "Error");
					$.validator.setDefaults({
						errorClass: "form-item--error",
						errorElement: "span"
					});
					$(".form", $container).each(function() {
						var $form = $(this),
							formParams = {
								rules: {},
								messages: {}
							},
							$formFields = $form.find("[data-validation]");

						$formFields.each(function() {
							var $field = $(this),
								fieldParams = $field.data("validation");

							formParams.messages[$field.attr("name")] = fieldParams.message ? fieldParams.message : "";

							formParams.rules[$field.attr("name")] = {};
							if(fieldParams.pattern) {
								formParams.rules[$field.attr("name")][fieldParams.pattern] = true;
							}
							if(fieldParams.mask) {
								$field.mask(fieldParams.mask, {
									autoclear: true,
									placeholder: "_"
								});
							}
							if(fieldParams.equalTo) {
								formParams.rules[$field.attr("name")]["equalTo"] = fieldParams.equalTo;
							}
							if(fieldParams.minlength) {
								formParams.rules[$field.attr("name")]["minlength"] = fieldParams.minlength;
							}
						});
						//console.log(formParams);
						$form.validate(formParams);
					});
				}
			},

			tooltips: {
				init: function() {
					$("[data-tooltip]", $sel.page).each(function() {
						var $item = $(this),
							params = $item.data("tooltip");
						//console.log(params);

						/*if(params.leftCornerPos) {
							params.functionPosition = function(instance, helper, position) {
								position.coord.left += 160;
								return position;
							}
						}*/

						$item.tooltipster($.extend({
							content: $(params.dest),
							contentAsHTML: true,
							animation: "fade",
							animationDuration: 100,
							arrow: true,
							interactive: true,
							side: "top",
							trigger: "custom",
							triggerOpen: {
								mouseenter: true,
								click: true,
								tap: true
							},
							triggerClose: {
								click: true,
								mouseleave: true,
								touchleave: true
							}
						}, params));
					});
				}
			},

			popups: {
				params: {
					type: "ajax",
					mainClass: "mfp-fade",
					removalDelay: 300,
					tClose: "Закрыть (ESC)",
					tLoading: "Загрузка...",
					callbacks: {
						ajaxContentAdded: function() {
							ALLTIME.forms.customize($(this.container));
							ALLTIME.forms.validation($(this.container));
						},
						open: function() {
							ALLTIME.forms.customize($(this.container));
							ALLTIME.forms.validation($(this.container));
						}
					},
					fixedContentPos: true,
					overflowY: "scroll"
				},
				init: function($container) {
					var self = this;

					if(!$container) {
						var $container = $sel.body;
					}
					$("[data-popup]", $container).each(function() {
						(function($p) {
							var params = $p.data("popup");
							if(params.handleMap) {
								params.callbacks = {};
								params.callbacks.open = function() {
									ALLTIME.shops.maps($(this.container));
								}
							}
							$p.magnificPopup($.extend({}, self.params, params));
						})($(this));
					});

					var hash = window.location.hash;
					if(hash && hash.indexOf("#form") != -1) {
						$.magnificPopup.open($.extend({
							items: {
								src: $("#" + hash.replace("#form_", "")),
								type: "inline"
							}
						}, self.params));
					}

					$sel.body.on("click", ".popup-close", function(e) {
						e.preventDefault();
						$.magnificPopup.close();
					});
				}
			},


			copyBlock: {
				init: function() {
					$(".copy-block").tooltipster({
						content: $("#copy-tooltip"),
						contentAsHTML: true,
						animation: "fade",
						animationDuration: 200,
						arrow: true,
						interactive: true,
						side: "top",
						trigger: "custom",
						triggerOpen: {},
						triggerClose: {
							click: true,
							scroll: true
						},
						timer: 1500
					});

					var clipboard = new ClipboardJS(".copy-block");
					clipboard.on("success", function(e) {
						$(e.trigger).tooltipster("open");
					});
				}
			},


			utils: {
				escapeRegExp: function(str) {
					return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
				},

				go: function(topPos, speed, callback) {
					var curTopPos = $sel.window.scrollTop(),
						diffTopPos = Math.abs(topPos - curTopPos);
					$sel.body.add($sel.html).animate({
						"scrollTop": topPos
					}, speed, function() {
						if(callback) {
							callback();
						}
					});
				}
			},


			animation: {
				init: function() {
					var self = this;

					self.wow.init();
				},

				wow: {
					blocks: [],
					$container: $sel.body,
					init: function($container, useCustomDivScrolling) {
						var self = this;

						if($container && $container.length) {
							self.$container = $container;
						}
						self.blocks = [];

						if(!useCustomDivScrolling) {
							$sel.window.on("scroll", function() {
								self.check();
							});
						} else {
							self.$container.on("scroll", function() {
								self.check(true);
							});
						}

						setTimeout(function() {
							self.prepare(useCustomDivScrolling);
							self.check(false, true);
						}, 250);
					},
					prepare: function(useCustomDivScrolling) {
						var self = this;
						$(".wow:not(.animated)", self.$container).each(function() {
							var $item = $(this),
								itemAnimation = $item.data("animationtype"),
								itemAnimationDuration = $item.data("animationduration"),
								itemTransitionDelay = $item.data("transitiondelay");

							if (!itemAnimationDuration) {
								itemAnimationDuration = 0;
							}

							self.blocks.push({
								"html": $item,
								"top": (useCustomDivScrolling ? $item.position().top : $item.offset().top),
								"typeAnimation": itemAnimation,
								"animation-duration" : itemAnimationDuration
							});

							//$item.addClass("before-" + itemAnimation);
							$item.css("animation-duration", itemAnimationDuration);

							if(itemTransitionDelay) {
								$item.css("transition-delay", itemTransitionDelay);
							}


						});
						
						//console.log(self.blocks);

					},
					check: function(useCustomDivScrolling, firstLoad) {
						var self = this,
							block = false,
							blockTop = false,
							top = (useCustomDivScrolling ? self.$container.scrollTop() : $sel.window.scrollTop()),
							buffer = (firstLoad ? parseInt($sel.window.height() + 100) : parseInt($sel.window.height()) / 1.15),
							delay = 0;

						for(var i = 0, len = self.blocks.length; i < len; i++) {
							block = self.blocks[i],
							blockTop = parseInt(block.top, 10);
							if(block.html.hasClass("animated")) {
								continue;
							}

							if(top + buffer >= blockTop) {
								block.html.css("transition-delay", (delay / 1000) + "s");
								block.html.addClass("animated");
								delay += 200;
								if(delay > 1200) {
									delay = 1600;
								}
							}

						}
					}
				}
			},

			mobile: {
				init: function() {
					var self = this;

					self.nav();
					self.submenu();
					self.search();
					self.filter();
				},

				nav: function() {
					$(".header-burger", $sel.page).on("click", function() {
						$sel.body.addClass("show-menu");
						bodyScrollLock.disableBodyScroll($(".mobile-nav-scroll-holder", $sel.body)[0]);	
						bodyScrollLock.disableBodyScroll($(".mobile-nav-scroll-inner", $sel.body)[0]);						
					});
					$(".mobile-nav-holder .mobile-close", $sel.page).on("click", function() {
						$sel.body.removeClass("show-menu");
						bodyScrollLock.enableBodyScroll($(".mobile-nav-scroll-holder", $sel.body)[0]);	
						bodyScrollLock.enableBodyScroll($(".mobile-nav-scroll-inner", $sel.body)[0]);	
					});
					$(".mobile-select-city", $sel.page).on("click", function(e) {
						e.preventDefault();
						$sel.body.toggleClass("show-cities");
						$(".mobile-nav .header-cities").toggleClass("show");
					});
				},

				search: function() {
					$("#mobile-toolbar-item-search", $sel.page).on("click", function() {
						$sel.body.addClass("show-search");
						bodyScrollLock.disableBodyScroll($(".mobile-search-scroll-holder", $sel.body)[0]);	
						bodyScrollLock.disableBodyScroll($(".mobile-search-scroll-inner", $sel.body)[0]);	
					});
					$(".mobile-search-holder .mobile-close", $sel.page).on("click", function() {
						$sel.body.removeClass("show-search");
						bodyScrollLock.enableBodyScroll($(".mobile-search-scroll-holder", $sel.body)[0]);	
						bodyScrollLock.enableBodyScroll($(".mobile-search-scroll-inner", $sel.body)[0]);
					});
				},

				submenu: function() {
					$(".footer-menu-item-holder--has-submenu, .mobile-nav-menu-item-holder--has-submenu", $sel.page).on("click", function(e) {
						e.preventDefault();
						$(this).toggleClass("open");
					});
					$(".footer-menu-item-holder--has-submenu nav a, .mobile-nav-menu-item-holder--has-submenu nav a", $sel.page).on("click", function(e) {
						e.stopPropagation();
					});
				},

				filter: function() {
					$(".mobile-filter-open", $sel.page).on("click", function(e) {
						e.preventDefault();
						$sel.body.addClass("show-filter");
						bodyScrollLock.disableBodyScroll($(".mobile-filter-scroll-holder", $sel.body)[0]);	
						bodyScrollLock.disableBodyScroll($(".mobile-filter-scroll-inner", $sel.body)[0]);	
					});
					$(".mobile-filter-holder .mobile-close", $sel.page).on("click", function() {
						$sel.body.removeClass("show-filter");
						bodyScrollLock.enableBodyScroll($(".mobile-filter-scroll-holder", $sel.body)[0]);	
						bodyScrollLock.enableBodyScroll($(".mobile-filter-scroll-inner", $sel.body)[0]);
					});

					$(".mobile-filter-item-heading", $sel.body).on("click", function() {
						$(this).closest(".mobile-filter-item").toggleClass("open");
					});
					$(".mobile-filter input:checkbox").on("change", function() {
						var $holder = $(this).closest(".mobile-filter-item");
						$holder.find("input:checked").length ? $holder.addClass("selected") : $holder.removeClass("selected");

						if($(".mobile-filter-item.selected").length) {
							$(".mobile-filter-open", $sel.page).addClass("selected");
						} else {
							$(".mobile-filter-open", $sel.page).removeClass("selected");
						}
					});
					$(".mobile-filter .form-item--range").on("change input", function(e, u) {
						var $holder = $(this).closest(".mobile-filter-item"),
							$range = $(this);
						($range[0].valueLow + "," + $range[0].valueHigh != $range.data("value")) ? $holder.addClass("selected") : $holder.removeClass("selected");
					});
					$(".mobile-filter .mobile-filter-heading-reset").on("click", function(e) {
						$(".mobile-filter-item").removeClass("selected");
						//$(".mobile-filter-holder .mobile-close", $sel.page).trigger("click");
					});
					$(".mobile-filter button:submit").on("click", function(e) {
						e.preventDefault();
						$(".mobile-filter-holder .mobile-close", $sel.page).trigger("click");
					});


					var $brandRows = $(".mobile-filter-brands .filter-row")
					$(".brand-search-field").on("keyup", function() {
						var query = $(this).val().toLowerCase();
						filterBrands(query);
					});
					function filterBrands(query) {
						if(query.length <= 1) {
							$brandRows.show();
						} else {
							$brandRows.each(function() {
								var $r = $(this);
									$rt = $r.find(".form-checkbox-title"),
									rtText = $rt.text().toLowerCase();
								if(rtText.includes(query)) {
									$r.show();
								} else {
									$r.hide();
								}
							});
						}
					}
				}
			},

			fix: function() {
				objectFitImages();
			},

			lazyLoad: function() {
				var ll = new LazyLoad();
			}

		};

	})();

	window.ALLTIME = ALLTIME;

	ALLTIME.init();

})(jQuery);
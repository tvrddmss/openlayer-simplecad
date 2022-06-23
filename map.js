var map_Obj = (function ()
{

    'use strict';

    //===============样式，用于样式基础===================================    
    //普通样式
    var nonTextStyle = new ol.style.Style({

        image: new ol.style.Circle({
            radius: 5,
            fill: new ol.style.Fill({
                color: '#0099FFFF',
            }),
            stroke: new ol.style.Stroke({
                color: '#FFFFFFCC',
                width: 1
            })
        }),
        zIndex: 1,

        fill: new ol.style.Fill({
            color: '#FFFFFF80'
        }),
        stroke: new ol.style.Stroke({
            color: '#0099FFFF',
            width: 1
        }),
        text: new ol.style.Text({
            // 字体与大小
            font: '13px Microsoft YaHei',
            //文字填充色
            fill: new ol.style.Fill({
                color: '#000000'
            }),
            //文字边界宽度与颜色
            stroke: new ol.style.Stroke({
                color: '#ffffff',
                width: 3
            }),
            // 显示文本，数字需要转换为文本string类型！
            /*text: "" + vectorSource.features.values_.limitvalue + "",*/
            offsetY: -15
        })
    });
    //选中样式
    let selectTextStyle = new ol.style.Style({

        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: '#ADD8E6FF',
            }),
            stroke: new ol.style.Stroke({
                color: '#FFFFFFCC',
                width: 1.5
            })
        }),
        zIndex: 2,

        fill: new ol.style.Fill({
            color: '#FFFFFF80'
        }),
        stroke: new ol.style.Stroke({
            color: '#ADD8E6FF',
            width: 3
        }),
        text: new ol.style.Text({
            // 字体与大小
            font: '13px Microsoft YaHei',
            //文字填充色
            fill: new ol.style.Fill({
                color: '#ADD8E6'
            }),
            //文字边界宽度与颜色
            stroke: new ol.style.Stroke({
                color: '#fff',
                width: 3
            }),
            // 显示文本，数字需要转换为文本string类型！
            /*text: "" + vectorSource.features.values_.limitvalue + "",*/
            offsetY: -15
        })
    });

    //===============规范化所画图形，主要用于规范小数点============================
    function FormatFeature(feature)
    {
        var isfanzhuan = false;
        switch (feature.getGeometry().getType())
        {
            case "Point":
                var point = [parseFloat(parseFloat(feature.getGeometry().getCoordinates()[0]).toFixed(4)),
                parseFloat(parseFloat(feature.getGeometry().getCoordinates()[1]).toFixed(4))];
                feature.getGeometry().setCoordinates(point);
                break;
            case "LineString":
                var co = feature.getGeometry().getCoordinates();
                for (var i = 0; i < co.length; i++)
                {
                    co[i] = [parseFloat(parseFloat(co[i][0]).toFixed(4)),
                    parseFloat(parseFloat(co[i][1]).toFixed(4))];
                }
                feature.getGeometry().setCoordinates(co);
                break;
            case "Polygon":
                var co = feature.getGeometry().getCoordinates();
                for (var i = 0; i < co.length; i++)
                {
                    var coo = co[i];
                    for (var k = 0; k < coo.length; k++)
                    {
                        co[i][k] = [parseFloat(parseFloat(coo[k][0]).toFixed(4)),
                        parseFloat(parseFloat(coo[k][1]).toFixed(4))];
                    }
                }
                //验证并调整点序
                for (var i = 0; i < co.length; i++)
                {
                    {
                        // if (i == 0)
                        // {
                        //     //第一个圈为外圈，正手原则
                        //     //X最小点，其上一个点Y大于，其下一个点Y，如果不是则反转

                        //     //获取X最小的点
                        //     var minx = 100000000;
                        //     var minindex = 0;
                        //     var coo = co[i];
                        //     for (var k = 0; k < coo.length; k++)
                        //     {
                        //         co[i][k] = [parseFloat(parseFloat(coo[k][0]).toFixed(4)), parseFloat(parseFloat(coo[k][1]).toFixed(4))];
                        //         if (co[i][k][0] < minx)
                        //         {
                        //             minx = co[i][k][0];
                        //             minindex = k;
                        //         }
                        //     }
                        //     var s_index = minindex - 1;
                        //     var x_index = minindex + 1;
                        //     if (s_index < 0)
                        //     {
                        //         s_index += (coo.length - 1);
                        //     }
                        //     if (x_index >= coo.length)
                        //     {
                        //         x_index = 1;
                        //     }

                        //     if (coo[s_index][1] < coo[x_index][1])
                        //     {
                        //         //点序反转
                        //         var newcoo = [];
                        //         for (var k = coo.length - 1; k >= 0; k--)
                        //         {
                        //             newcoo.push([parseFloat(parseFloat(coo[k][0]).toFixed(4)), parseFloat(parseFloat(coo[k][1]).toFixed(4))]);
                        //         }
                        //         co[i] = newcoo;
                        //     }
                        // }
                        // else
                        // {
                        //     //第二个圈之后为洞，反手原则
                        //     //X最小点，其上一个点Y小于，其下一个点Y，如果不是则反转

                        //     //获取X最小的点
                        //     var minx = 100000000;
                        //     var minindex = 0;
                        //     var coo = co[i];
                        //     for (var k = 0; k < coo.length; k++)
                        //     {
                        //         co[i][k] = [parseFloat(parseFloat(coo[k][0]).toFixed(4)), parseFloat(parseFloat(coo[k][1]).toFixed(4))];
                        //         if (co[i][k][0] < minx)
                        //         {
                        //             minx = co[i][k][0];
                        //             minindex = k;
                        //         }
                        //     }
                        //     var s_index = minindex - 1;
                        //     var x_index = minindex + 1;
                        //     if (s_index < 0)
                        //     {
                        //         s_index += (coo.length - 1);
                        //     }
                        //     if (x_index >= coo.length)
                        //     {
                        //         x_index = 1;
                        //     }

                        //     if (coo[s_index][1] > coo[x_index][1])
                        //     {
                        //         //点序反转
                        //         var newcoo = [];
                        //         for (var k = coo.length - 1; k >= 0; k--)
                        //         {
                        //             newcoo.push([parseFloat(parseFloat(coo[k][0]).toFixed(4)), parseFloat(parseFloat(coo[k][1]).toFixed(4))]);
                        //         }
                        //         co[i] = newcoo;
                        //     }
                        // }
                    }

                    if (i == 0)
                    {
                        //第一个圈为外圈，正手原则
                        //X最小点，其上一个点夹角应小于，其下一个点夹角，如果不是则反转

                        //获取X最小的点
                        var minx = 100000000;
                        var minindex = 0;
                        var coo = co[i];
                        for (var k = 0; k < coo.length; k++)
                        {
                            co[i][k] = [parseFloat(parseFloat(coo[k][0]).toFixed(4)), parseFloat(parseFloat(coo[k][1]).toFixed(4))];
                            if (co[i][k][0] < minx)
                            {
                                minx = co[i][k][0];
                                minindex = k;
                            }
                        }
                        var s_index = minindex - 1;
                        var x_index = minindex + 1;
                        if (s_index < 0)
                        {
                            s_index += (coo.length - 1);
                        }
                        if (x_index >= coo.length)
                        {
                            x_index = 1;
                        }
                        //
                        var s_bearing = turf.rhumbBearing(coo[minindex], coo[s_index]);
                        var x_bearing = turf.rhumbBearing(coo[minindex], coo[x_index]);

                        if (s_bearing >= x_bearing)
                        {
                            //点序反转
                            isfanzhuan = true;
                            var newcoo = [];
                            for (var k = coo.length - 1; k >= 0; k--)
                            {
                                newcoo.push([parseFloat(parseFloat(coo[k][0]).toFixed(4)), parseFloat(parseFloat(coo[k][1]).toFixed(4))]);
                            }
                            co[i] = newcoo;
                        }
                    }
                    else
                    {
                        //第二个圈之后为洞，反手原则
                        //获取X最小的点
                        var minx = 100000000;
                        var minindex = 0;
                        var coo = co[i];
                        for (var k = 0; k < coo.length; k++)
                        {
                            co[i][k] = [parseFloat(parseFloat(coo[k][0]).toFixed(4)), parseFloat(parseFloat(coo[k][1]).toFixed(4))];
                            if (co[i][k][0] < minx)
                            {
                                minx = co[i][k][0];
                                minindex = k;
                            }
                        }
                        var s_index = minindex - 1;
                        var x_index = minindex + 1;
                        if (s_index < 0)
                        {
                            s_index += (coo.length - 1);
                        }
                        if (x_index >= coo.length)
                        {
                            x_index = 1;
                        }

                        var s_bearing = turf.rhumbBearing(coo[minindex], coo[s_index]);
                        var x_bearing = turf.rhumbBearing(coo[minindex], coo[x_index]);

                        if (s_bearing <= x_bearing)
                        {
                            //点序反转
                            isfanzhuan = true;
                            var newcoo = [];
                            for (var k = coo.length - 1; k >= 0; k--)
                            {
                                newcoo.push([parseFloat(parseFloat(coo[k][0]).toFixed(4)), parseFloat(parseFloat(coo[k][1]).toFixed(4))]);
                            }
                            co[i] = newcoo;
                        }
                    }
                }
                feature.getGeometry().setCoordinates(co);
                break;
        }
        return isfanzhuan;
    }
    //==================切割核心=======================================
    function select_qiege(selectfeature, dao)
    {
        //异常信息
        var ex;
        //要切割的面
        var selected_feature = selectfeature;
        //切割用的刀，线
        var feat_cutline = dao;
        var geometry = feat_cutline.getGeometry();
        var coords = geometry.getCoordinates();
        var coords_new = [];
        //新刀的点，创建为面用于切割，全面
        var step = 0.000001;

        //检查被切割的面不能为空
        if (selected_feature == null)
        {
            ex = '没有选中面';
            throw ex;
        }
        //检查被切割的面不必须为面
        //被切割的面（turf）格式，用于切割：肉
        var polygon_r = null;
        switch (selected_feature.getGeometry().getType())
        {
            case "Polygon":
                polygon_r = turf.polygon(selected_feature.getGeometry().getCoordinates(), {});
                break;
            default:
                ex = '只能切割面';
                throw ex;
                //polygon1 = turf.multiPolygon(selected_feature.getGeometry().getCoordinates(), {});
                break;
        }

        //刀（turf）格式，用于切割：刀
        //var polygon_d = turf.polygon([coords], {});
        var polygon_d = turf.buffer(turf.lineString(coords, {}), 0.000001, { units: 'meters' });
        //切割后的面(turf)格式，multiPolygon
        var polygon_sr = turf.difference(polygon_r, polygon_d);
        //判定切割成功
        if (polygon_sr == null)
        {
            ex = '切割失败，核心错误';
            throw ex;
        }
        //记录操作前的状态
        var fes = [selected_feature];
        var isnew = [false];
        // 创建多边形
        var MultiPolygon = null;
        switch (polygon_sr.geometry.type)
        {
            case "MultiPolygon":
                MultiPolygon = new ol.geom.MultiPolygon(polygon_sr.geometry.coordinates);
                break;
            default:
                ex = '切割失败，切割后格式错误，请保持切割线的起点与终点在图形外，并穿过图形';
                throw ex;
                break;
        }
        if (MultiPolygon.getCoordinates().length < 2)
        {
            ex = "结果不能是一个图形，请重新操作";
            throw ex;
        }
        //根据闭环情况创建多个多边图
        for (var i = 0; i < MultiPolygon.getCoordinates().length; i++)
        {
            // 返回要素
            var fe_temp = new ol.Feature(new ol.geom.Polygon(MultiPolygon.getCoordinates()[i]));
            //source.addFeature(fe_temp);
            that.property.copyall(selected_feature, fe_temp);
            fes.push(fe_temp);
            isnew.push(true);
        }
        for (var i = 1; i < fes.length; i++)
        {
            FormatFeature(fes[i]);
            that.active_layer.getSource().addFeature(fes[i]);
        }
        that.undo.indo(fes, isnew);
        that.active_layer.getSource().removeFeature(selected_feature);
        selected_feature = null;
    }

    var that = {
        //地图
        map: null,
        //缩放按钮
        zoom_control: null,
        //缩放条
        zoomslider_control: null,
        //比例尺
        scaleline_control: null,
        //地图框
        canvas: null,
        //操作模式 "draw":"select":"edit":"measure","view"
        model: null,


        //激活的图层
        active_layer: null,

        //初始化
        init: function (theme_layer)
        {
            //===============初始化地图============================
            {
                //===============地图初始化============================
                that.map = new ol.Map({
                    layers: that.layer.init(theme_layer),
                    target: 'layout_content',
                    view: new ol.View({
                        center: [0, 0],
                        zoom: 20,
                        minZoom: 12,
                        maxZoom: 30,
                        extent: [-5000, -5000, 5000, 5000],
                    }),
                    //加载控件到地图容器中
                    controls: new ol.control.defaults({
                        zoom: true,
                        rotate: false,
                        attribution: false
                    }),
                    //坐标系
                    projection: ol.proj.get('EPSG:3857'),
                });
                //保存图片用
                that.map.once('postcompose', function (event)
                {
                    that.canvas = event.context.canvas;
                });

                //===============辅助线初始化坐标原点============================
                {

                    that.draw.fzx_collection = [];
                    var modal_fzx = {};
                    modal_fzx.id = 'x';
                    modal_fzx.name = 'X轴';
                    modal_fzx.point1_x = '1';
                    modal_fzx.point1_y = '0';
                    modal_fzx.point2_x = '-1';
                    modal_fzx.point2_y = '0';
                    modal_fzx.points = [];
                    modal_fzx.points.push([parseFloat(modal_fzx.point1_x), parseFloat(modal_fzx.point1_y)]);
                    modal_fzx.points.push([parseFloat(modal_fzx.point2_x), parseFloat(modal_fzx.point2_y)]);
                    that.draw.fzx_collection.push(modal_fzx);

                    modal_fzx = {};
                    modal_fzx.id = 'Y';
                    modal_fzx.name = 'Y轴';
                    modal_fzx.point1_x = '0';
                    modal_fzx.point1_y = '1';
                    modal_fzx.point2_x = '0';
                    modal_fzx.point2_y = '-1';
                    modal_fzx.points = [];
                    modal_fzx.points.push([parseFloat(modal_fzx.point1_x), parseFloat(modal_fzx.point1_y)]);
                    modal_fzx.points.push([parseFloat(modal_fzx.point2_x), parseFloat(modal_fzx.point2_y)]);
                    that.draw.fzx_collection.push(modal_fzx);

                }

                //===============屏蔽双击缩放============================
                var dblClickInteraction = that.map
                    .getInteractions()
                    .getArray()
                    .find(interaction =>
                    {
                        return interaction instanceof ol.interaction.DoubleClickZoom;
                    });
                that.map.removeInteraction(dblClickInteraction);


                //===============缩放按钮控制============================
                that.map.getControls().forEach(function (element, index, array)
                {
                    if (element instanceof ol.control.Zoom)
                    {
                        that.zoom_control = element;
                    }
                });

                //===============缩放条控制============================
                that.zoomslider_control = new ol.control.ZoomSlider();
                that.map.addControl(that.zoomslider_control);

                //===============添加网格============================
                var graticuleLayer = new ol.Graticule({
                    // map: map,
                    strokeStyle: new ol.style.Stroke({
                        color: 'rgba(255, 255, 255, 0.8)',
                        width: 0.6
                    }),
                    targetSize: 100
                });
                graticuleLayer.setMap(that.map);

                //===============添加比例尺============================
                that.scaleline_control = new ol.control.ScaleLine({
                    Units: 'metric',//单位有5种：degrees imperial us nautical metric
                });
                that.map.addControl(that.scaleline_control);

                //===============禁止拖拽地图============================
                that.setisCanDragPan(false);

                //===============缩放事件监听============================
                that.map.on("moveend", function (e)
                {
                    var map = that.map;
                    var mapExtent = map.getView().calculateExtent(map.getSize());
                    var map_center = ol.extent.getCenter(mapExtent);
                    //that.map_mouse_zb.innerText = "缩放级别：" + map.getView().getZoom() + "    屏幕中心点坐标：X:" + parseFloat(map_center[0]).toFixed(4) + "    Y:" + parseFloat(map_center[1]).toFixed(4);
                });
            }
            //选中模式初始化
            that.select.init();
            //变形模式初始化
            that.edit.init();

        },
        //撤销
        undo: {
            //撤销支持说明，仅支持在当前激活图层的操作，切换图层时，将丢失，撤销后失去选中效果：
            /*
            1、新画模式：点、线、面、洞、点集新建
            2、选择模式：选中鼠标拖动、键盘快捷键移动、编辑顶点、复制、删除、合并、切割、手画切割
            3、变形模式：支持
            4、导入模式：线转面，（导入其他图层、清空当前图层，不支持）
            5、属性：属性的修改保存、及复制粘贴。
            6、颜色：颜色的修改保存
            */

            // 撤回栈
            stack: [],

            //撤销栈变动
            event_change: null,

            //撤销栈增加
            indo: function (items, isnews)
            {
                var features = [];
                for (var i = 0; i < items.length; i++)
                {
                    var item = items[i];
                    var feature = that.feature.getNewFeatureWithPropertyByFeature(item);

                    feature.ol_uid = item.ol_uid;

                    feature.new = isnews[i];
                    features.push(feature);
                }
                that.undo.stack.push(features);
                if (that.undo.stack.length > 9)
                {
                    that.undo.stack.splice(0, 1);
                }
                if (that.undo.event_change != null)
                {
                    that.undo.event_change(that.undo.stack.length);
                }
            },
            //撤销操作
            undo: function ()
            {
                //取消选中，避免显示错误
                that.select.clearSelect();
                let features = that.undo.stack.pop();
                if (features != null)
                {
                    //清空选中项
                    //that.edit.interaction_transform.getFeatures().clear();
                    //that.select.interaction_select.getFeatures().clear();
                    for (var i = 0; i < features.length; i++)
                    {
                        var feature = features[i];
                        //console.log(feature.ol_uid)
                        var findFeatureByUid1 = that.undo.findFeatureByUid(feature.ol_uid);
                        if (findFeatureByUid1 != null)
                        {
                            that.active_layer.getSource().removeFeature(findFeatureByUid1);
                        }
                        //console.log(feature)
                        if (!feature.new)
                        {
                            that.active_layer.getSource().addFeature(feature);
                        }
                        //that.edit.interaction_transform.select(feature);
                    }
                }
                if (that.undo.event_change != null)
                {
                    that.undo.event_change(that.undo.stack.length);
                }
            },

            findFeatureByUid: function (uid)
            {
                let features = that.active_layer.getSource().getFeatures();
                var r = features.filter(function (x)
                {
                    return x.ol_uid == uid;

                });
                var result = null;
                if (r.length > 0)
                {
                    result = r[0];
                }
                return result;
            },

            //清空撤销栈
            clear: function ()
            {
                that.undo.stack = [];
                if (that.undo.event_change != null)
                {
                    that.undo.event_change(that.undo.stack.length);
                }
            }

        },
        //===========================================================页面控件操作================================================
        // 设置鼠标位置显示控件容器
        setmouseposition_control_target: function (html)
        {
            //===============光标位置============================
            var mousePositionControl = new ol.control.MousePosition({
                // coordinateFormat: createStringXY(4), // 默认格式 **,**
                coordinateFormat: function (e)
                { // 这里格式化成 X: **  Y: **
                    let stringifyFunc = ol.coordinate.createStringXY(4);
                    let str = stringifyFunc(e);
                    //console.log(str);
                    var x = parseFloat(str.split(',')[0]).toFixed(4);
                    var y = parseFloat(str.split(',')[1]).toFixed(4);
                    return 'X: ' + x + '&nbsp;&nbsp;&nbsp;&nbsp;' + ' Y: ' + y;
                },
                //projection: 'EPSG:4326', // 和地图坐标系保持一致
                className: 'custom-mouse-position', // css类名
                target: html // 显示位置鼠标坐标位置DOM
            });
            // 添加控制控件到地图上
            that.map.addControl(mousePositionControl);

        },
        // 设置比例尺控件容器
        setscaleline_control_target: function (html)
        {
            that.map.removeControl(that.scaleline_control);
            that.scaleline_control.setTarget(html);
            that.map.addControl(that.scaleline_control);
        },
        //设置比例尺控件显隐
        setscaleline_control_visible: function (visible)
        {
            if (visible)
            {
                that.map.addControl(that.scaleline_control);
            }
            else
            {
                that.map.removeControl(that.scaleline_control);
            }
        },
        //设置缩放条控件容器
        setzoomslider_control_target: function (html)
        {
            that.map.removeControl(that.zoomslider_control);
            that.zoomslider_control.setTarget(html);
            that.map.addControl(that.zoomslider_control);
        },
        //设置缩放条控件显隐
        setzoomslider_control_visible: function (visible)
        {
            if (visible)
            {
                that.map.addControl(that.zoomslider_control);
            }
            else
            {
                that.map.removeControl(that.zoomslider_control);
            }
        },
        //设置缩放按钮控件容器
        setzoom_control_target: function (html)
        {
            that.map.removeControl(that.zoom_control);
            that.zoom_control.setTarget(html);
            that.map.addControl(that.zoom_control);
        },
        //设置缩放按钮控件显隐
        setzoom_control_visible: function (visible)
        {
            if (visible)
            {
                that.map.addControl(that.zoom_control);
            }
            else
            {
                that.map.removeControl(that.zoom_control);
            }
        },

        //设置是否可以拖拽地图
        setisCanDragPan: function (bol)
        {
            that.map.getInteractions().forEach(function (element, index, array)
            {
                if (element instanceof ol.interaction.DragPan)
                {
                    element.setActive(bol);
                }
            });
        },

        //放大
        zoomIn: function ()
        {
            that.map.getView().setZoom(that.map.getView().getZoom() + 1);
        },
        //缩小
        zoomOut: function ()
        {
            that.map.getView().setZoom(that.map.getView().getZoom() - 1);
        },

        //回归原点
        reor: function ()
        {
            // 设置地图中心，将地图移动到中心点
            that.map.getView().setCenter([0, 0]);
            //map.getView().setZoom(16);
            that.map.render();
        },
        //===========================================================模式变化相关================================================
        //模式切换
        modelChange: function (type)
        {
            switch (that.model)
            {
                case "draw":
                    that.draw.end();
                    break;
                case "select":
                    that.select.end();
                    break;
                case "edit":
                    that.edit.end();
                    break;
                case "measure":
                    that.measure.end();
                    break;
                case "view":
                    that.view.end();
                    break;
                case "shiqu":
                    that.shiqu.end();
                    break;
                case 'daoru':
                    that.daoru.end();
                    break;

            }
            switch (type)
            {
                case "draw":
                    that.draw.start();
                    break;
                case "select":
                    that.select.start();
                    break;
                case "edit":
                    that.edit.start();
                    break;
                case "measure":
                    that.measure.start();
                    break;
                case "view":
                    that.view.start();
                    break;
                case "shiqu":
                    that.shiqu.start();
                    break;
                case 'daoru':
                    that.daoru.start();
                    break;
            }
            that.model = type;
        },
        //新画
        draw: {

            //新画模式，所画图形的类型
            model: null,
            //新画模式，用int
            interaction_draw: null,
            //新画模式，画图形结束事件
            event_draw_end: null,
            //新画模式，辅助线集合
            fzx_collection: [],
            //新画模式，辅助线控件
            interaction_snapGuides: null,

            //新画
            start: function ()
            {
                that.draw.model = null;
                that.draw.modelChange('Polygon');
            },
            end: function ()
            {
                //画图的layer
                that.map.removeInteraction(that.draw.interaction_draw);
                //辅助线
                that.map.removeInteraction(that.draw.interaction_snapGuides);
            },

            //根据所画类型变化
            modelChange: function (type)
            {
                if (type != that.draw.model)
                {
                    that.draw.model = type;
                    //清空当前所画类型:画笔、辅助线
                    that.draw.end();
                    var map = that.map;
                    var source = that.active_layer.getSource();
                    switch (type)
                    {
                        case "Point":
                            that.draw.interaction_draw = new ol.interaction.Draw({
                                source: source,
                                type: type
                            });
                            map.addInteraction(that.draw.interaction_draw);

                            break;
                        case "LineString":
                        case "Polygon":
                            that.draw.interaction_draw = new ol.interaction.Draw({
                                source: source,
                                type: type
                            });
                            map.addInteraction(that.draw.interaction_draw);

                            break;
                        case "Hole":
                            that.draw.interaction_draw = new ol.interaction.DrawHole({
                                layers: that.active_layer
                            });
                            map.addInteraction(that.draw.interaction_draw);
                            that.draw.interaction_draw.on('drawend', function (event)
                            {
                                var feat = event.feature;
                                FormatFeature(feat);
                                var co = feat.getGeometry().getCoordinates();
                                co.splice(co.length - 1, 1);
                                var oldfeature = new ol.Feature(new ol.geom.Polygon(co));
                                oldfeature.ol_uid = feat.ol_uid;
                                that.undo.indo([oldfeature], [false]);
                                //画图结束事件
                                if (that.draw.event_draw_end != null)
                                {
                                    that.draw.event_draw_end(feat);
                                }
                            });
                            // that.draw.interaction_draw.on('drawstart', function (event)
                            // {
                            //     var feat = event.feature;
                            //     that.undo.indo([feat], [false]);
                            // });

                            break;
                    }
                    that.draw.fzx_refresh();
                    //画完之后如果不是画洞则给新增的图形，进行规范化数据坐标，并创建属性，加入退回栈等操作，如果是hole则单独操作
                    switch (type)
                    {
                        case "Point":
                        case "LineString":
                        case "Polygon":
                            that.draw.interaction_draw.on('drawend', function (event)
                            {
                                //selected_feature = event.feature;
                                var feat = event.feature;
                                var geometry = feat.getGeometry();
                                var coords = geometry.getCoordinates();
                                //创建图形的属性
                                that.property.creat(feat);
                                //格式化图形的坐标数据
                                FormatFeature(feat);
                                //将图形以新建模式送入撤销栈
                                that.undo.indo([feat], [true]);
                                //画图结束事件
                                if (that.draw.event_draw_end != null)
                                {
                                    that.draw.event_draw_end(feat);
                                }
                            });
                            that.draw.interaction_draw.on('drawstart', function (event)
                            {
                                //selected_feature = event.feature;
                                //div_input_point.mystyle.removeProperty('display');
                            });
                            break;
                    }
                }
            },
            //新画图形，修改坐标----之前版本用于参考
            update_co: function (coordinate)
            {
                //以下全部为openlayers内容属性，非接口
                that.draw.interaction_draw.sketchCoords_[that.draw.interaction_draw.sketchCoords_.length - 2] = coordinate;
                that.draw.interaction_draw.sketchLineCoords_[that.draw.interaction_draw.sketchLineCoords_.length - 2] = coordinate;
                that.draw.interaction_draw.sketchLine_.getGeometry().setCoordinates(that.draw.interaction_draw.sketchLineCoords_);


                var co = that.draw.interaction_draw.sketchFeature_.getGeometry().getCoordinates();
                co[co.length - 2] = coordinate;
                that.draw.interaction_draw.sketchFeature_.getGeometry().setCoordinates(co);

                //以下注释代码为内容参考用

                //draw.sketchCoords_.splice(draw.sketchCoords_.length - 1, 0, coordinate);
                //draw.sketchLineCoords_.splice(draw.sketchLineCoords_.length - 1, 0, coordinate);
                //draw.sketchLine_.getGeometry().setCoordinates(draw.sketchLineCoords_);

                //var co = draw.sketchFeature_.getGeometry().getCoordinates()[0];
                //co.splice(co.length - 2, 0, coordinate);
                //draw.sketchFeature_.getGeometry().setCoordinates([co]);

                //condition_: ƒ(t)
                //dispatching_: { }
                //disposed_: false
                //downPx_: (2)[543, 465]
                //downTimeout_: undefined
                //dragVertexDelay_: 500
                //features_: null
                //finishCondition_: ƒ R()
                //finishCoordinate_: (2)[-46.5788141112793, 24.85696329976924]
                //freehandCondition_: ƒ(t)
                //freehand_: false
                //geometryFunction_: ƒ(t, e)
                //geometryName_: undefined
                //handlingDownUpSequence: false
                //lastDragTime_: 1652166516189
                //listeners_: { change: active: Array(2), drawstart: Array(1), drawend: Array(2), drawabort: Array(1) }
                //map_: e { disposed_: false, pendingRemovals_: { … }, dispatching_: { … }, listeners_: { … }, revision_: 0, … }
                //maxPoints_: Infinity
                //minPoints_: 3
                //mode_: "Polygon"
                //ol_lm: { change: active: Array(2), drawstart: Array(1), drawend: Array(2), drawabort: Array(1) }
                //ol_uid: "29"
                //overlay_: e { disposed_: false, pendingRemovals_: { … }, dispatching_: { … }, listeners_: { … }, revision_: 748, … }
                //pendingRemovals_: { }
                //revision_: 0
                //shouldHandle_: false
                //sketchCoords_: [Array(3)]
                //sketchFeature_: e { disposed_: false, pendingRemovals_: { … }, dispatching_: { … }, listeners_: { … }, revision_: 92, … }
                //sketchLineCoords_: (3)[Array(2), Array(2), Array(2)]
                //sketchLine_: e { disposed_: false, pendingRemovals_: { … }, dispatching_: { … }, listeners_: { … }, revision_: 91, … }
                //sketchPoint_: e { disposed_: false, pendingRemovals_: { … }, dispatching_: { … }, listeners_: { … }, revision_: 105, … }
                //snapTolerance_: 12
                //source_: e { disposed_: false, pendingRemovals_: { … }, dispatching_: { … }, listeners_: { … }, revision_: 0, … }
                //squaredClickTolerance_: 36
                //stopClick_: false
                //stopDown: ƒ w()
                //targetPointers: []
                //trackedPointers_: { }
                //type_: "Polygon"
                //values_: { active: true }
                //[[Prototype]]: e

            },

            //新建图形根据坐标点集
            addFeatureByCo: function (lx, co)
            {
                let geom = null;
                switch (lx)
                {
                    case 'Point':
                        {
                            geom = new ol.geom.Point(co);
                        }
                        break;
                    case 'LineString':
                        {
                            geom = new ol.geom.LineString(co);
                        }
                        break;
                    case 'Polygon':
                        {
                            geom = new ol.geom.Polygon(co);
                        }
                        break;
                }

                let feat = new ol.Feature(geom);
                that.property.creat(feat);
                FormatFeature(feat);
                //将图形以新建模式送入撤销栈
                that.undo.indo([feat], [true]);
                that.active_layer.getSource().addFeature(feat);
            },

            //===========================================================新画模式下辅助线================================================
            //获取所有辅助线数据
            fzx_getall: function ()
            {
                return that.draw.fzx_collection;
            },
            //新建辅助线
            fzx_add: function (model)
            {
                //计算坐标
                model = that.draw.fzx_countpoint(model);
                that.draw.fzx_collection.push(model);
                that.draw.fzx_refresh();
            },
            //删除辅助线
            fzx_delete: function (id)
            {
                var index = null;
                for (var i = 0; i < that.draw.fzx_collection.length; i++)
                {
                    if (that.draw.fzx_collection[i].id == id)
                    {
                        index = i;
                        break;
                    }
                }
                if (index != null)
                {
                    that.draw.fzx_collection.splice(index, 1);
                    that.draw.fzx_refresh();
                }
            },
            //获取辅助线,通过ID
            fzx_getfzxbyid: function (id)
            {
                var result = null;
                for (var i = 0; i < that.draw.fzx_collection.length; i++)
                {
                    if (that.draw.fzx_collection[i].id == id)
                    {
                        result = that.draw.fzx_collection[i];
                    }
                }
                return result;
            },
            //设置辅助线,通过ID
            fzx_setfzxbyid: function (model)
            {
                //计算坐标
                model = that.draw.fzx_countpoint(model);
                for (var i = 0; i < that.draw.fzx_collection.length; i++)
                {
                    if (that.draw.fzx_collection[i].id == model.id)
                    {
                        that.draw.fzx_collection[i] = model;
                    }
                }
                that.draw.fzx_refresh();
            },
            //辅助线刷新
            fzx_refresh: function ()
            {
                if (that.draw.interaction_draw != null)
                {
                    that.map.removeInteraction(that.draw.interaction_snapGuides);
                    that.draw.interaction_snapGuides = new ol.interaction.SnapGuides({
                        vectorClass: ol.layer.VectorImage
                    });
                    that.map.addInteraction(that.draw.interaction_snapGuides);
                    for (var i = 0; i < that.draw.fzx_collection.length; i++)
                    {
                        that.draw.interaction_snapGuides.addGuide(that.draw.fzx_collection[i].points);
                    }
                    that.draw.interaction_snapGuides.setDrawInteraction(that.draw.interaction_draw);
                }
            },
            //计算坐标方法
            fzx_countpoint: function (model)
            {
                model.points = [];
                model.points.push([parseFloat(model.point1_x), parseFloat(model.point1_y)]);
                switch (model.type)
                {
                    case 'zuobiao':
                        model.points.push([parseFloat(model.point2_x), parseFloat(model.point2_y)]);
                        break
                    case 'jiaodu':
                        var jiaodu = -parseFloat(model.jiaodu);
                        jiaodu -= 90;
                        if (jiaodu < -180)
                        {
                            jiaodu += 360;
                        }
                        // jiaodu = jiaodu;
                        var destination = turf.rhumbDestination(turf.point(model.points[0]), 500, jiaodu, { units: 'miles' });
                        model.points.push(destination.geometry.coordinates);
                        break;
                }
                return model;
            },
        },
        //选择
        select: {

            //选中模式下，当前操作模式:move/editpoints/clipbydraw/clip
            model: null,
            //选中模式中用于选中的操作控件
            interaction_select: null,
            //选中模式中用于选中后移动的
            interaction_translate: null,

            //选中变更及选中图形点集变更事件:
            event_feature_co_changed: null,

            //编辑顶点时，顶点所在图层
            editpoints_layer: null,
            //编辑坐标点集合
            editpoints_collection: null,
            //编辑顶点图层选中用
            editpoints_interaction_select: null,
            //编辑顶点图层移动图形用
            editpoints_interaction_translate: null,
            //编辑顶点图层移动图形用
            editpoints_interaction_modify: null,

            //编辑顶点图层移动图形用的预设图形
            editpoints_preview_feature: null,
            //编辑顶点坐标时，在窗口输入坐标后，保存回调
            event_editpoints_showpointco: null,
            //编辑顶点坐标时，结束回调，用于关闭一些窗口
            event_editpoints_end: null,


            //切割划线工具
            clip_interaction_draw: null,
            //切割用刀，用于预览
            clip_line_dao: null,


            init: function ()
            {
                //选中操作后的样式变更及支持多选
                that.select.interaction_select = new ol.interaction.Select({
                    style: function (feature)
                    {
                        //保持原有样式画虚线
                        var tempstyle = that.layer.getByFeature(feature).getStyle()(feature);
                        tempstyle.getStroke().setLineDash([10, 10]);
                        //保持原有样式
                        // var tempstyle = selectTextStyle.clone();
                        // var name = feature.name;
                        // if (name != null && name != undefined)
                        // {
                        //     tempstyle.getText().setText("" + name + "");
                        // }
                        return tempstyle;
                    },
                    multi: true,
                });

                that.select.interaction_select.on('select', that.select.selected_change);
                //===============选中模式操作--移动============================
                {
                    that.select.interaction_translate = new ol.interaction.Translate({
                        features: that.select.interaction_select.getFeatures(),
                        hitTolerance: 10,
                    });
                    //这样是动态给map插入这个属性。
                    that.map.addInteraction(that.select.interaction_translate);
                    that.select.interaction_translate.on("translatestart", function (e)
                    {
                        //拖动开始的监听函数
                        //console.log("开始拖动");
                        var item = e.features.item(0);
                        that.undo.indo([item], [false]);
                    });

                    that.select.interaction_translate.on("translating", function (e)
                    {
                        //拖动中
                        that.select.selected_change(e);
                    });

                    that.select.interaction_translate.on("translateend", function (e)
                    {
                        //拖到结束监听函数
                        //console.log("拖动结束");
                        var item = e.features.item(0);
                        FormatFeature(item);
                        that.select.selected_change(e);
                    });
                }
            },

            start: function ()
            {
                that.map.addInteraction(that.select.interaction_select);
            },
            end: function ()
            {
                that.select.model_change(null);
                //选中后切割用--有可能有
                that.map.removeInteraction(that.select.clip_interaction_draw);

                //选中int
                that.map.removeInteraction(that.select.interaction_select);
                //选中后移动modify
                that.select.clearSelect();
            },
            //选择模式下，小模式变化:move/editpoints/clipbydraw/clip
            model_change: function (type)
            {
                //旧模式
                switch (that.select.model)
                {
                    case 'move':
                        break;
                    case 'editpoints':
                        that.select.editpoint_end();
                        break;
                    case 'clipbydraw'://
                        that.select.clip_bydraw_end();
                        break;
                    case 'clip'://

                        break;
                }
                that.select.model = type;
                //新模式
                switch (that.select.model)
                {
                    case 'move':
                        break;
                    case 'editpoints':
                        break;
                    case 'clipbydraw':
                        break;
                    case 'clip':
                        break;
                }
            },

            //清空选中
            clearSelect: function ()
            {
                that.select.interaction_select.getFeatures().clear();
                //触发页面显示变化
                if (that.select.event_feature_co_changed != null)
                {
                    that.select.event_feature_co_changed();
                }
            },

            //获取选中项
            getSelectFeatures: function ()
            {
                return that.select.interaction_select.getFeatures().getArray();
            },
            //选中模式下，选中图形变更
            selected_change: function (e)
            {
                //判断选中项是否为当前layer
                var features = that.select.interaction_select.getFeatures().getArray();
                for (var i = 0; i < features.length; i++)
                {
                    //features[i].setStyle(null);
                    if (that.active_layer != that.layer.getByFeature(features[i]))
                    {
                        //移除不属于当前图层的图形
                        that.select.interaction_select.getFeatures().removeAt(i);
                    }
                }
                //触发页面显示变化
                if (that.select.event_feature_co_changed != null)
                {
                    that.select.event_feature_co_changed();
                }
            },

            //应用属性
            setSelectFeature_atr: function (ats)
            {
                if (that.select.getSelectFeatures().length == 0)
                {
                    throw '未选中图形';
                    return;
                }
                var selected_feature = that.select.getSelectFeatures()[0];

                that.undo.indo([selected_feature], [false]);
                that.property.set(selected_feature, ats);
                selected_feature.changed();
            },
            //应用颜色
            setSelectFeature_color: function (newmodel)
            {
                if (that.select.getSelectFeatures().length == 0)
                {
                    throw '未选中图形';
                    return;
                }
                var selected_feature = that.select.getSelectFeatures()[0];

                that.undo.indo([selected_feature], [false]);

                selected_feature.mystyle = newmodel;
                //that.property.set(selected_feature, selected_feature);

                selected_feature.changed();
            },

            //移动图形
            feature_move: function (selected_feature, step_x, step_y)
            {
                //已修改模式进入撤回栈
                that.undo.indo([selected_feature], [false]);
                switch (selected_feature.getGeometry().getType())
                {
                    case "Point":
                        var co = selected_feature.getGeometry().getCoordinates();
                        co[0] += step_x;
                        co[1] += step_y;
                        selected_feature.getGeometry().setCoordinates(co);
                        break;
                    case "LineString":
                        var co = [];
                        for (var i = 0; i < selected_feature.getGeometry().getCoordinates().length; i++)
                        {
                            var coo = selected_feature.getGeometry().getCoordinates()[i];
                            coo[0] += step_x;
                            coo[1] += step_y;
                            co.push(coo);
                        }
                        selected_feature.getGeometry().setCoordinates(co);
                        break;
                    case "Polygon":

                        var co = [];
                        for (var i = 0; i < selected_feature.getGeometry().getCoordinates().length; i++)
                        {
                            var coo = selected_feature.getGeometry().getCoordinates()[i];
                            for (var k = 0; k < selected_feature.getGeometry().getCoordinates()[i].length; k++)
                            {
                                coo[k][0] += step_x;
                                coo[k][1] += step_y;
                            }
                            co.push(coo);
                        }
                        selected_feature.getGeometry().setCoordinates(co);
                        break;

                    case "MultiPolygon":
                        var ar = selected_feature.getGeometry().getCoordinates();
                        var co = [];
                        for (var i = 0; i < ar.length; i++)
                        {
                            var arr = ar[i];
                            var coo = [];
                            for (var k = 0; k < arr.length; k++)
                            {
                                var arrr = arr[k];
                                var cooo = [];
                                for (var j = 0; j < arrr.length; j++)
                                {
                                    arrr[j][0] += step_x;
                                    arrr[j][1] += step_y;
                                    cooo.push(arrr[j]);
                                }
                                coo.push(cooo);
                            }
                            co.push(coo);
                        }

                        selected_feature.getGeometry().setCoordinates(co);
                        break;
                    case "Circle":
                        var co = selected_feature.getGeometry().getCenter();
                        co[0] += step_x;
                        co[1] += step_y;
                        selected_feature.getGeometry().setCenter(co);
                        break;
                }
                FormatFeature(selected_feature);
                if (that.select.event_feature_co_changed != null)
                {
                    that.select.event_feature_co_changed();
                }

            },
            //===========================================================编辑顶点================================================
            //修改坐标
            editpoint_start: function (showpointwindow)
            {
                //检查是否有选中图形
                if (that.select.getSelectFeatures().length != 1)
                {
                    throw "请选中一个图形";
                }
                that.select.event_editpoints_showpointco = showpointwindow;
                //添加临时点用于选中编辑坐标
                var selected_feature = that.select.getSelectFeatures()[0];
                //判断选中项为面
                switch (selected_feature.getGeometry().getType())
                {
                    case "LineString":
                    case "Polygon":
                        break;
                    case "Point":
                    default:
                        throw ("此类型不能编辑顶点");
                        return;
                        break;
                }
                //屏蔽选中和移动
                that.select.interaction_select.setActive(false);
                that.select.interaction_translate.setActive(false);

                //坐标点集合
                that.select.editpoints_collection = [];
                var points = that.select.editpoints_collection;
                var co = selected_feature.getGeometry().getCoordinates();
                switch (selected_feature.getGeometry().getType())
                {
                    case "LineString":
                        {
                            for (var i = 0; i < co.length; i++)
                            {
                                var point = new ol.Feature(new ol.geom.Point(co[i]));
                                point.name = (i + 1);
                                point.x = i;
                                points.push(point);
                            }
                        }
                        break;
                    case "Polygon":
                        {
                            for (var i = 0; i < co.length; i++)
                            {
                                for (var j = 0; j < co[i].length - 1; j++)
                                {
                                    var point = new ol.Feature(new ol.geom.Point(co[i][j]));
                                    point.name = (i + 1) + "-" + (j + 1);
                                    point.x = i;
                                    point.y = j;
                                    points.push(point);
                                }
                            }
                        }
                        break;
                }
                that.select.editpoints_layer.getSource().addFeatures(points);

                //添加选中及移动，用于选中点及移动点
                that.select.editpoints_interaction_select = new ol.interaction.Select({
                    style: function (feature)
                    {
                        var select_style = selectTextStyle.clone();

                        select_style.image_ = new ol.style.Circle({
                            radius: 5,
                            fill: new ol.style.Fill({
                                color: '#FFFF00FF',
                            }),
                            stroke: new ol.style.Stroke({
                                color: [255, 255, 255, 0.75],
                                width: 1.5
                            })
                        });
                        var name = feature.name;
                        if (name != null && name != undefined)
                        {
                            select_style.getText().setText("" + name + "");
                        }
                        return select_style;

                    },
                    layers: [that.select.editpoints_layer],
                    multi: false,
                });
                that.map.addInteraction(that.select.editpoints_interaction_select);

                that.select.editpoints_interaction_select.on('select', function (e)
                {

                    //判断选中项是否为当前layer
                    var features = that.select.editpoints_interaction_select.getFeatures().getArray();
                    for (var i = 0; i < features.length; i++)
                    {
                        //features[i].setStyle(null);
                        if (that.select.editpoints_layer != that.layer.getByFeature(features[i]))
                        {
                            //移除不属于当前图层的图形
                            that.select.editpoints_interaction_select.getFeatures().removeAt(i);
                        }
                    }

                    if (features.length > 0)
                    {
                        var current_point = features[0];
                        //展示点序号及坐标
                        that.select.editpoint_showPointCo(current_point);
                    }


                    if (that.select.editpoints_interaction_modify != null)
                    {
                        that.map.removeInteraction(that.select.editpoints_interaction_modify);
                    }
                    //===============鼠标拖动移动============================
                    if (that.select.editpoints_interaction_select.getFeatures().getArray().length > 0)
                    {
                        // that.select.editpoints_interaction_translate = new ol.interaction.Translate({
                        //     features: that.select.editpoints_interaction_select.getFeatures(),
                        //     hitTolerance: 0,
                        // });
                        // //这样是动态给map插入这个属性。
                        // that.map.addInteraction(that.select.editpoints_interaction_translate);
                        // that.select.editpoints_interaction_translate.on("translatestart", function (e)
                        // {
                        //     //加入预设图形
                        //     that.select.editpoints_preview_feature = selected_feature.clone();
                        //     that.select.editpoints_layer.getSource().addFeature(that.select.editpoints_preview_feature);
                        //     //拖动开始的监听函数
                        //     //console.log("开始拖动");
                        //     // var item = e.features.item(0);
                        //     // that.undo.indo([item], [false]);


                        //     //打开吸附
                        //     that.snap.show();
                        // });

                        // that.select.editpoints_interaction_translate.on("translating", function (e)
                        // {
                        //     //拖动中
                        //     //预设图形变化
                        //     var current_point = e.features.item(0);
                        //     //FormatFeature(current_point);
                        //     var new_co = current_point.getGeometry().getCoordinates();

                        //     var co = that.select.editpoints_preview_feature.getGeometry().getCoordinates();
                        //     switch (that.select.editpoints_preview_feature.getGeometry().getType())
                        //     {
                        //         case "LineString":
                        //             {
                        //                 co[current_point.x] = new_co;
                        //             }
                        //             break;
                        //         case "Polygon":
                        //             {
                        //                 co[current_point.x][current_point.y] = new_co;
                        //                 //如果是第一个节点，也是最后一个节点
                        //                 if (current_point.y == 0)
                        //                 {
                        //                     co[current_point.x][co[current_point.x].length - 1] = new_co;
                        //                 }
                        //             }
                        //             break;
                        //     }
                        //     that.select.editpoints_preview_feature.getGeometry().setCoordinates(co);
                        //     //联动窗口点序号及坐标
                        //     that.select.editpoint_showPointCo(current_point);
                        // });

                        // that.select.editpoints_interaction_translate.on("translateend", function (e)
                        // {

                        //     //删除预设图形
                        //     if (that.select.editpoints_preview_feature != null)
                        //     {
                        //         that.select.editpoints_layer.getSource().removeFeature(that.select.editpoints_preview_feature);
                        //         that.select.editpoints_preview_feature = null;
                        //     }
                        //     //拖到结束监听函数
                        //     //console.log("拖动结束");
                        //     // var item = e.features.item(0);
                        //     // FormatFeature(item);
                        //     //that.select.selected_change(e);
                        //     var current_point = e.features.item(0);
                        //     FormatFeature(current_point);
                        //     var new_co = current_point.getGeometry().getCoordinates();
                        //     //编辑
                        //     that.select.editpoint_updatePointCo(current_point, new_co);
                        //     //联动窗口点序号及坐标
                        //     that.select.editpoint_showPointCo(current_point);

                        //     //关闭吸附
                        //     that.snap.hide();
                        // });


                        var current_point = that.select.editpoints_interaction_select.getFeatures().getArray()[0];
                        that.select.editpoints_interaction_modify = new ol.interaction.Modify({
                            features: that.select.interaction_select.getFeatures(),//that.select.editpoints_interaction_select.getFeatures()
                            condition: function (e)
                            {
                                var co = that.map.getPixelFromCoordinate(current_point.getGeometry().getCoordinates());
                                var x_min = co[0] - 4;
                                var x_max = co[0] + 4;
                                var y_min = co[1] - 4;
                                var y_max = co[1] + 4;

                                if (e.pixel[0] > x_min
                                    && e.pixel[0] < x_max
                                    && e.pixel[1] > y_min
                                    && e.pixel[1] < y_max)
                                {
                                    return true;
                                }
                                else
                                {
                                    return false;
                                }
                            },
                            deleteCondition: function (e)//
                            {
                                return false;
                            },
                            insertVertexCondition: function (e)//插入点
                            {
                                return false;
                            },
                        });
                        that.map.addInteraction(that.select.editpoints_interaction_modify);
                        that.select.editpoints_interaction_modify.on('modifystart', function (e)
                        {
                            //加入预设图形
                            that.select.editpoints_preview_feature = selected_feature.clone();
                            that.select.editpoints_layer.getSource().addFeature(that.select.editpoints_preview_feature);

                            that.undo.indo([e.features.item(0)], [false]);
                            //打开吸附
                            that.snap.show();
                        });
                        that.select.editpoints_interaction_modify.on('modifyend', function (e)
                        {
                            //删除预设图形
                            if (that.select.editpoints_preview_feature != null)
                            {
                                that.select.editpoints_layer.getSource().removeFeature(that.select.editpoints_preview_feature);
                                that.select.editpoints_preview_feature = null;
                            }
                            //that.select.editpoints_interaction_select.getFeatures().getArray()[0].setCoordinates(co);
                            //拖到结束监听函数
                            //console.log("拖动结束");
                            // var item = e.features.item(0);
                            // FormatFeature(item);
                            //that.select.selected_change(e);
                            // var current_point = e.features.item(0);
                            // FormatFeature(current_point);
                            // var new_co = current_point.getGeometry().getCoordinates();
                            // //编辑
                            // that.select.editpoint_updatePointCo(current_point, new_co);

                            var item = e.features.item(0);
                            var isfanzhuan = FormatFeature(item);
                            var co = item.getGeometry().getCoordinates();
                            var tempresultxy;
                            switch (item.getGeometry().getType())
                            {
                                case "LineString":
                                    {
                                        current_point.getGeometry().setCoordinates(co[current_point.x]);
                                    }
                                    break;
                                case "Polygon":
                                    {
                                        if (isfanzhuan)
                                        {
                                            var tempresult;
                                            for (var co_i = 0; co_i < co.length; co_i++)
                                            {
                                                for (var co_j = 0; co_j < co[co_i].length - 1; co_j++)
                                                {
                                                    tempresult = points.filter((point, index, arr) =>
                                                    {
                                                        return co[co_i][co_j][0] == point.getGeometry().getCoordinates()[0]
                                                            && co[co_i][co_j][1] == point.getGeometry().getCoordinates()[1];
                                                    });
                                                    if (tempresult.length > 0)
                                                    {
                                                        tempresult[0].name = (co_i + 1) + "-" + (co_j + 1);
                                                        tempresult[0].x = co_i;
                                                        tempresult[0].y = co_j;
                                                    }
                                                    else
                                                    {
                                                        current_point.name = (co_i + 1) + "-" + (co_j + 1);
                                                        current_point.x = co_i;
                                                        current_point.y = co_j;
                                                        current_point.getGeometry().setCoordinates(co[current_point.x][current_point.y]);
                                                    }
                                                }
                                            }

                                        }
                                        else
                                        {
                                            current_point.getGeometry().setCoordinates(co[current_point.x][current_point.y]);
                                        }
                                    }
                                    break;
                            }

                            //联动窗口点序号及坐标
                            that.select.editpoint_showPointCo(current_point);
                            //关闭吸附
                            that.snap.hide();
                        });
                    }

                });
            },
            //展示要编辑的点信息，并联动
            editpoint_showPointCo: function (current_point)
            {
                that.select.event_editpoints_showpointco(current_point.name, current_point.getGeometry().getCoordinates(), function (new_co)
                {
                    //编辑
                    that.select.editpoint_updatePointCo(current_point, new_co);
                });
            },
            //具体修改图形坐标方法
            editpoint_updatePointCo: function (current_point, new_co)
            {
                //点移动
                current_point.getGeometry().setCoordinates(new_co);
                FormatFeature(current_point);
                //判断所要修改的图形类型
                var selected_feature = that.select.getSelectFeatures()[0];
                //规范化后再进入退回栈
                var temp_feature = that.feature.getNewFeatureWithPropertyByFeature(selected_feature);
                temp_feature.ol_uid = selected_feature.ol_uid;
                FormatFeature(temp_feature);
                //压入撤销栈
                that.undo.indo([temp_feature], [false]);

                var select_co = selected_feature.getGeometry().getCoordinates();
                switch (selected_feature.getGeometry().getType())
                {
                    case "LineString":
                        {
                            select_co[current_point.x] = new_co;
                            // selected_feature.getGeometry().setCoordinates(select_co);
                        }
                        break;
                    case "Polygon":
                        {
                            select_co[current_point.x][current_point.y] = new_co;
                            //如果是第一个节点，也是最后一个节点
                            if (current_point.y == 0)
                            {
                                select_co[current_point.x][select_co[current_point.x].length - 1] = new_co;
                            }
                            // var geo = selected_feature.getGeometry().clone();
                            // geo.setCoordinates(select_co);
                            // selected_feature.setGeometry(geo);
                            //selected_feature.getGeometry().setCoordinates(select_co);
                        }
                        break;
                }
                selected_feature.getGeometry().setCoordinates(select_co);
                //触发页面显示变化
                if (that.select.event_feature_co_changed != null)
                {
                    that.select.event_feature_co_changed();
                }
            },
            //结束修改坐标
            editpoint_end: function ()
            {
                //去除编辑图层的选中及移动
                that.map.removeInteraction(that.select.editpoints_interaction_select);
                that.map.removeInteraction(that.select.editpoints_interaction_translate);

                if (that.select.editpoints_collection != null && that.select.editpoints_collection.length > 0)
                {
                    for (var i = 0; i < that.select.editpoints_collection.length; i++)
                    {
                        that.select.editpoints_layer.getSource().removeFeature(that.select.editpoints_collection[i]);
                    }
                    that.select.editpoints_collection = [];
                    //删除预设图形
                    if (that.select.editpoints_preview_feature != null)
                    {
                        that.select.editpoints_layer.getSource().removeFeature(that.select.editpoints_preview_feature);
                        that.select.editpoints_preview_feature = null;
                    }
                    //格式化编辑后的图形
                    FormatFeature(that.select.getSelectFeatures()[0]);
                    //放开选中和移动
                    that.select.interaction_select.setActive(true);
                    that.select.interaction_translate.setActive(true);
                }
                //是否触发关闭窗口事件
                if (that.select.event_editpoints_end != null)
                {
                    that.select.event_editpoints_end();
                }
            },

            //复制--偏移量数组，x,y
            copy: function (pianyi)
            {
                var step_x = pianyi[0];
                var step_y = pianyi[1];
                if (that.select.getSelectFeatures().length == 0)
                {
                    throw '未选中图形';
                    return;
                }
                var selected_feature = that.select.getSelectFeatures()[0];

                var new_feature = that.feature.getNewFeatureWithPropertyByFeature(selected_feature);
                new_feature.name += "（复制）";
                //偏移
                switch (new_feature.getGeometry().getType())
                {
                    case "Point":
                        var co = new_feature.getGeometry().getCoordinates();
                        co[0] += step_x;
                        co[1] += step_y;
                        new_feature.getGeometry().setCoordinates(co);
                        break;
                    case "LineString":
                        var co = [];
                        for (var i = 0; i < new_feature.getGeometry().getCoordinates().length; i++)
                        {
                            var coo = new_feature.getGeometry().getCoordinates()[i];
                            coo[0] += step_x;
                            coo[1] += step_y;
                            co.push(coo);
                        }
                        new_feature.getGeometry().setCoordinates(co);
                        break;
                    case "Polygon":

                        var co = [];
                        for (var i = 0; i < new_feature.getGeometry().getCoordinates().length; i++)
                        {
                            var coo = new_feature.getGeometry().getCoordinates()[i];
                            for (var k = 0; k < new_feature.getGeometry().getCoordinates()[i].length; k++)
                            {
                                coo[k][0] += step_x;
                                coo[k][1] += step_y;
                            }
                            co.push(coo);
                        }
                        new_feature.getGeometry().setCoordinates(co);
                        break;

                }
                that.active_layer.getSource().addFeatures([new_feature]);
                that.undo.indo([new_feature], [true]);
            },
            //删除
            delete: function ()
            {
                if (that.select.getSelectFeatures().length == 0)
                {
                    return;
                }
                var selected_feature = that.select.getSelectFeatures()[0];

                that.undo.indo([selected_feature], [false]);
                that.active_layer.getSource().removeFeature(selected_feature);
                //清空选中，这样才能消除显示
                that.select.clearSelect();
            },
            //合并
            union: function (ol_uid)
            {

                var selectedFeatures = that.select.getSelectFeatures();
                if (selectedFeatures.length > 1)
                {
                    var copyshuxingfeat = null;//保留属性的图形
                    var layer = that.active_layer;
                    for (var i = 0; i < selectedFeatures.length; i++)
                    {
                        if (selectedFeatures[i].ol_uid == ol_uid)
                        {
                            copyshuxingfeat = selectedFeatures[i];
                        }
                        //判断选中项为面
                        switch (selectedFeatures[i].getGeometry().getType())
                        {
                            default:
                                alert("只合并面类型");
                                return;
                                break;
                            case "Polygon":
                                break;
                        }
                        //判断是否属于同一个图层
                        if (layer == null)
                        {
                            layer = that.layer.getByFeature(selectedFeatures[i]);
                        }
                        if (layer != that.layer.getByFeature(selectedFeatures[i]))
                        {
                            alert("所选图形不在激活图层内");
                            return;
                        }
                    }
                    if (copyshuxingfeat == null)
                    {
                        throw '未找到保留属性的图形';
                    }
                    try
                    {
                        var polygon1 = turf.polygon(selectedFeatures[0].getGeometry().getCoordinates(), {});

                        var polygon_temp = null;
                        var difference_result = polygon1;
                        for (var i = 1; i < selectedFeatures.length; i++)
                        {
                            polygon_temp = turf.polygon(selectedFeatures[i].getGeometry().getCoordinates(), {});
                            difference_result = turf.union(difference_result, polygon_temp);
                        }


                        if (difference_result != null)
                        {
                            // 创建多边形
                            var Polygon = null;
                            switch (difference_result.geometry.type)
                            {
                                case "Polygon":
                                    Polygon = new ol.geom.Polygon(turf.cleanCoords(difference_result).geometry.coordinates)
                                    break;
                                default:
                                    throw '结果图形不能形成面';
                                    break;
                            }
                            // 返回要素
                            var fe = new ol.Feature(Polygon);
                            layer.getSource().addFeature(fe);
                            //复制属性
                            that.property.copyall(copyshuxingfeat, fe);
                            FormatFeature(fe);
                            var indo_feats = [fe];
                            var indo_isnew = [true];
                            selectedFeatures.forEach(item =>
                            {
                                indo_feats.push(item);
                                indo_isnew.push(false);
                            });
                            that.undo.indo(indo_feats, indo_isnew);
                            //移除原有图形
                            selectedFeatures.forEach(item =>
                            {
                                layer.getSource().removeFeature(item);
                            });
                        }
                        that.select.clearSelect();
                    }
                    catch (ex)
                    {
                        throw (ex);
                    }
                }
                else
                {
                    throw ("请先选中多个图形！");
                }
            },
            //平滑
            smooth: function ()
            {
                if (that.select.getSelectFeatures().length == 0)
                {
                    throw '未选中图形';
                    return;
                }
                var selected_feature = that.select.getSelectFeatures()[0];

                switch (selected_feature.getGeometry().getType())
                {
                    case "Point":
                    case "Polygon":
                        throw '只能对线类型进行操作';
                        break;
                    case "LineString":
                        that.undo.indo([selected_feature], [false]);
                        var line = turf.lineString(selected_feature.getGeometry().getCoordinates());
                        var curved = turf.bezierSpline(line);
                        selected_feature.getGeometry().setCoordinates(curved.geometry.coordinates);
                        FormatFeature(selected_feature);
                        if (that.select.event_feature_co_changed != null)
                        {
                            that.select.event_feature_co_changed();
                        }
                        break;
                }


            },

            //===========================================================切割相关================================================
            //切割--手画切
            clip_bydraw_start: function (callbackfunction)
            {
                if (that.select.getSelectFeatures().length == 0)
                {
                    throw '未选中图形';
                    return;
                }
                var selected_feature = that.select.getSelectFeatures()[0];

                //判断选中项为面
                switch (selected_feature.getGeometry().getType())
                {
                    case "Point":
                    case "LineString":
                    case "Circle":
                        alert("此类型不能分割");
                        return;
                        break;
                    case "Polygon":
                        break;
                }


                //暂时取消点选
                //选中int
                //that.map.removeInteraction(that.select.interaction_select);
                that.select.interaction_select.setActive(false);
                that.select.interaction_translate.setActive(false);
                //分割按钮画线工具
                that.select.clip_interaction_draw = new ol.interaction.Draw({
                    source: that.active_layer.getSource(),
                    type: "LineString"
                });
                //添加切割画线工具
                that.map.addInteraction(that.select.clip_interaction_draw);

                that.select.clip_interaction_draw.on('drawstart', function (event)
                {
                    //打开吸附
                    that.snap.show();
                });


                that.select.clip_interaction_draw.on('drawend', function (event)
                {
                    try
                    {
                        var feat_cutline = event.feature;
                        select_qiege(selected_feature, event.feature);
                    }
                    catch (e)
                    {
                        setTimeout(() =>
                        {
                            try
                            {
                                that.active_layer.getSource().removeFeature(feat_cutline);
                            } catch (ex)
                            {

                            }
                        }, 100);
                        controlObj.message.result.show("剪切失败：" + e);
                    }
                    setTimeout(() =>
                    {
                        that.active_layer.getSource().removeFeature(feat_cutline);
                        callbackfunction();
                    }, 100);

                });
            },
            //切割--手画切-结束
            clip_bydraw_end: function ()
            {
                //关闭吸附
                that.snap.hide();
                //去除切割画线工具
                that.map.removeInteraction(that.select.clip_interaction_draw);
                //开放点选
                that.select.interaction_select.setActive(true);
                that.select.interaction_translate.setActive(true);

                that.select.clearSelect();
            },
            //添加切割线
            clip_show_dao: function (co)
            {
                that.select.clip_hide_dao();
                if (co.length > 1)
                {
                    //新建线类型
                    that.select.clip_line_dao = new ol.Feature(new ol.geom.LineString(co));
                    that.active_layer.getSource().addFeature(that.select.clip_line_dao);

                    var mystyle = {};
                    mystyle.stroke_width = '2';
                    mystyle.stroke_color = '#DC143CFF';
                    mystyle.fill_color = '#ffcc33FF'

                    var fe_style = new ol.style.Style({
                        fill: new ol.style.Fill({//填充
                            color: 'rgba(255, 255, 255, 0.2)',
                        }),
                        stroke: new ol.style.Stroke({//线条
                            color: mystyle.stroke_color,
                            width: mystyle.stroke_width
                        }),
                        image: new ol.style.Circle({//圆
                            radius: 7,
                            fill: new ol.style.Fill({
                                color: mystyle.fill_color
                            })
                        })
                    });
                    that.select.clip_line_dao.setStyle(fe_style);
                    that.select.clip_line_dao.mystyle = mystyle;
                }

            },
            //消除切割线
            clip_hide_dao: function ()
            {
                if (that.select.clip_line_dao != null)
                {
                    that.active_layer.getSource().removeFeature(that.select.clip_line_dao);
                    that.select.clip_line_dao = null;
                }
            },
            //用切割线，切
            clip_qie_dao: function ()
            {
                if (that.select.getSelectFeatures().length == 0)
                {
                    throw '未选中图形';
                    return;
                }
                var selected_feature = that.select.getSelectFeatures()[0];

                select_qiege(selected_feature, that.select.clip_line_dao);

                that.select.clip_hide_dao();
                that.select.clearSelect();
            },


        },
        //变换
        edit: {

            interaction_transform: null,

            init: function ()           
            {
                that.edit.interaction_transform = new ol.interaction.Transform({
                    addCondition: ol.events.condition.shiftKeyOnly
                });
                // 事件监听
                that.edit.interaction_transform.on(['select'], function (e)
                {
                    //判断选中项是否为当前layer
                    var features = e.features.getArray();
                    for (var i = 0; i < features.length; i++)
                    {
                        if (that.active_layer != that.layer.getByFeature(features[i]))
                        {
                            //移除不属于当前图层的图形
                            that.edit.interaction_transform.getFeatures().removeAt(i);
                            that.edit.interaction_transform.select(null);
                        }
                    }
                });
                that.edit.interaction_transform.on(['rotatestart', 'translatestart', 'scalestart'], function (e)
                {

                    if (that.edit.interaction_transform.getFeatures().getArray().length > 0)
                    {
                        var item = e.features.item(0);
                        that.undo.indo([item], [false]);
                    }
                });
                that.edit.interaction_transform.on(['rotateend', 'translateend', 'scaleend'], function (e)
                {
                    var item = e.features.item(0);
                    FormatFeature(item);
                });
            },
            start: function ()
            {
                that.map.addInteraction(that.edit.interaction_transform);
            },
            end: function ()
            {
                //变形int
                that.map.removeInteraction(that.edit.interaction_transform);
            },
        },
        //测量
        measure: {

            //用于测量
            layer: null,
            interaction_draw: null,
            overlay_collection: [],

            //overlay外壳
            tooltip: null,
            //overlay内容
            tooltipElement: null,

            start: function ()
            {
                that.map.on('singleclick', that.measure.pointListener);
            },
            end: function ()
            {
                that.map.removeInteraction(that.measure.interaction_draw);
                that.map.un('singleclick', that.measure.pointListener); //取消事件监听的应用，之后再点击地图时，你将不会再看到坐标
                //去除吸附
                that.snap.hide();
            },
            //清空测量
            clear: function ()
            {
                that.measure.layer.getSource().clear();
                for (var i = 0; i < that.measure.overlay_collection.length; i++)
                {
                    that.map.removeOverlay(that.measure.overlay_collection[i]);
                }
                that.measure.overlay_collection = [];

            },
            //测量类型变化
            typeChange: function (type)
            {

                that.map.removeInteraction(that.measure.interaction_draw);

                //(type == 'area' ? 'Polygon' : 'LineString');
                that.measure.interaction_draw = new ol.interaction.Draw({
                    source: that.measure.layer.getSource(),
                    type: (type),
                    dragVertexDelay: 0,//默认500，在指针下移后将当前顶点拖动到其确切位置之前的延迟（毫秒）。【防止绘图完成后，地图移动】
                    style: new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: 'rgba(255, 255, 255, 0.7)'
                        }),
                        stroke: new ol.style.Stroke({
                            color: 'rgba(255, 255, 255, 0.5)',
                            lineDash: [10, 10],
                            width: 2,
                        }),
                        image: new ol.style.Circle({
                            radius: 5,
                            stroke: new ol.style.Stroke({
                                color: 'rgba(255, 255, 255, 0.7)'
                            }),
                            fill: new ol.style.Fill({
                                color: 'rgba(255, 255, 255, 0.7)'
                            })
                        })
                    })
                });
                that.map.addInteraction(that.measure.interaction_draw);

                //显示吸附
                that.snap.show();
                var listener;
                that.measure.interaction_draw.on('drawstart',
                    function (evt)
                    {
                        that.measure.createTooltip();
                        that.measure.overlay_collection.push(that.measure.tooltip);
                        var tooltipCoord = evt.coordinate;
                        listener = evt.feature.getGeometry().on('change',
                            function (evt)
                            {
                                var geom = evt.target;
                                var output;
                                if (geom instanceof ol.geom.Polygon)
                                {
                                    output = that.measure.formatArea(geom, 1);
                                    tooltipCoord = geom.getInteriorPoint().getCoordinates();
                                } else if (geom instanceof ol.geom.LineString)
                                {
                                    output = that.measure.formatLength(geom, 1);
                                    tooltipCoord = geom.getLastCoordinate();
                                }
                                that.measure.tooltipElement.innerHTML = output;
                                that.measure.tooltip.setPosition(tooltipCoord);
                                that.measure.tooltip.myposition = tooltipCoord;
                            });
                    },
                    this);
                that.measure.interaction_draw.on('drawend',
                    function (evt)
                    {

                        switch (evt.feature.getGeometry().getType())
                        {
                            case 'LineString':
                                var co = evt.feature.getGeometry().getCoordinates();
                                var startco = co[0];
                                var endco = co[co.length - 1];
                                //横线
                                {
                                    var f_h = new ol.Feature(new ol.geom.LineString([startco, [endco[0], startco[1]]]));
                                    f_h.lineDash = [10, 10];
                                    that.measure.layer.getSource().addFeature(f_h);
                                    var element_h = document.createElement('div');
                                    element_h.className = 'tooltip tooltip-static';
                                    var ovlay_h =
                                        new ol.Overlay({
                                            id: "measureh",
                                            element: element_h,
                                            offset: [15, -15],
                                            positioning: 'bottom-center'
                                        });
                                    var output = '<div style="color:white;">';
                                    output += '<br/>左右：<br/>';
                                    var len_dx = startco[0] - endco[0];
                                    if (Math.abs(len_dx) > 1000)
                                    {
                                        output += parseFloat(len_dx / 1000).toFixed(4) + '' + 'km';
                                    }
                                    else
                                    {
                                        output += parseFloat(len_dx).toFixed(4) + '' + 'm';
                                    }
                                    output += '</div>';
                                    element_h.innerHTML = output;

                                    that.measure.overlay_collection.push(ovlay_h);
                                    that.map.addOverlay(ovlay_h);

                                    var tooltipCoord = [(startco[0] + endco[0]) / 2, startco[1]];
                                    ovlay_h.setPosition(tooltipCoord);
                                    ovlay_h.myposition = tooltipCoord;
                                }
                                //竖线
                                {
                                    var f_s = new ol.Feature(new ol.geom.LineString([[endco[0], startco[1]], endco]));
                                    f_s.lineDash = [10, 10];
                                    that.measure.layer.getSource().addFeature(f_s);
                                    var element_s = document.createElement('div');
                                    element_s.className = 'tooltip tooltip-static';
                                    var ovlay_s =
                                        new ol.Overlay({
                                            id: "measures",
                                            element: element_s,
                                            offset: [15, -15],
                                            positioning: 'bottom-center'
                                        });

                                    var output = '<div style="color:white;">';
                                    output += '<br/>上下：<br/>';
                                    var len_dx = startco[1] - endco[1];
                                    if (Math.abs(len_dx) > 1000)
                                    {
                                        output += parseFloat(len_dx / 1000).toFixed(4) + '' + 'km';
                                    }
                                    else
                                    {
                                        output += parseFloat(len_dx).toFixed(4) + '' + 'm';
                                    }

                                    output += '</div>';
                                    element_s.innerHTML = output;

                                    that.measure.overlay_collection.push(ovlay_s);
                                    that.map.addOverlay(ovlay_s);
                                    var tooltipCoord = [endco[0], (startco[1] + endco[1]) / 2];
                                    ovlay_s.setPosition(tooltipCoord);
                                    ovlay_s.myposition = tooltipCoord;
                                }
                                break;
                        }
                        that.measure.tooltipElement.className = 'tooltip tooltip-static';
                        that.measure.tooltip.setOffset([0, -7]);
                        that.measure.tooltipElement = null;
                        //var html = createMeasureTooltip();
                        //that.measure.overlay_collection.push(that.measure.tooltip);
                        ol.Observable.unByKey(listener);
                    },
                    this);

            },

            //隐藏图层时，隐藏overlay
            hideOverlay: function ()
            {
                for (var i = 0; i < that.measure.overlay_collection.length; i++)
                {
                    that.measure.overlay_collection[i].setPosition(undefined);
                }
            },
            showOverlay: function ()
            {
                for (var i = 0; i < that.measure.overlay_collection.length; i++)
                {
                    that.measure.overlay_collection[i].setPosition(that.measure.overlay_collection[i].myposition);
                }
            },


            //创建测量工具提示
            createTooltip: function ()
            {
                if (that.measure.tooltipElement)
                {
                    that.measure.tooltipElement.parentNode.removeChild(that.measure.tooltipElement);
                }
                that.measure.tooltipElement = document.createElement('div');
                that.measure.tooltipElement.className = 'tooltip tooltip-measure';
                that.measure.tooltip = new ol.Overlay({
                    id: "measure",
                    element: that.measure.tooltipElement,
                    offset: [15, -15],
                    positioning: 'bottom-center'
                });
                that.map.addOverlay(that.measure.tooltip);
                return that.measure.tooltip;
            },
            //测量点功能的监听事件
            pointListener: function (event)
            {

                //var point = that.map.getEventCoordinate(event.originalEvent) + "";
                //var points = point.split(",");
                //var pointX;
                //var pointY;
                //for (var i = 0; i < points.length; i++) {
                //    if (i == 0) {
                //        pointX = Math.round(points[i] * 1000) / 1000;
                //    } else {
                //        pointY = Math.round(points[i] * 1000) / 1000;
                //    }
                //}


                //var calloutElement = document.createElement('div');
                //calloutElement.innerHTML = "X:" + pointX + " Y:" + pointY;

                //calloutElement.className = 'tooltip-measurepoint';
                //var calloutTooltip = new ol.Overlay({
                //    id: "measurepoint",
                //    element: calloutElement,
                //    offset: [0, -25],
                //    positioning: 'center-center',
                //});
                //that.map.addOverlay(calloutTooltip);

                //calloutTooltip.setPosition([pointX, pointY]);

            },
            //格式化长度
            formatLength: function (line, type)
            {
                var length = line.getLength();
                var output = '<div style="color:white;">';
                output += '总长：<br/>';
                if (length > 1000)
                {
                    output += parseFloat(length / 1000).toFixed(4) + '' + 'km';
                } else
                {
                    length = parseFloat(line.getLength()).toFixed(4);
                    output += (length) + '' + 'm';
                }

                // var points = line.getCoordinates();
                // //东西
                // var len_dx = points[points.length - 1][0] - points[0][0];
                // output += '<br/>左右：<br/>';
                // if (Math.abs(len_dx) > 1000)
                // {
                //     output += parseFloat(len_dx / 1000).toFixed(4) + '' + 'km';
                // }
                // else
                // {
                //     output += parseFloat(len_dx).toFixed(4) + '' + 'm';
                // }
                // //南北
                // var len_nb = points[points.length - 1][1] - points[0][1];
                // output += '<br/>上下：<br/>';
                // if (Math.abs(len_nb) > 1000)
                // {
                //     output += parseFloat(len_nb / 1000).toFixed(4) + '' + 'km';
                // }
                // else
                // {
                //     output += parseFloat(len_nb).toFixed(4) + '' + 'm';
                // }
                output += '</div>';
                return output;
            },
            //格式化面积
            formatArea: function (polygon, type)
            {
                var area;
                area = polygon.getArea();
                var output = '<div style="color:white;">';
                if (area > 1000000)
                {
                    output += parseFloat(area / 1000000).toFixed(4) +
                        '' + 'km<sup>2</sup>';
                } else
                {
                    area = parseFloat(area).toFixed(4);
                    output += (area) +
                        '' + 'm<sup>2</sup>';
                }
                output += '</div>';
                return output;
            }
        },
        //浏览模式
        view: {
            start: function ()
            {
            },
            end: function ()
            {
            },
        },
        //拾取模式
        shiqu: {

            //拾取图层
            layer: null,
            //拾取类型:zuobiao/tuxing
            type: null,
            //拾取反馈
            event_clickget: null,
            start: function ()
            {
                var feats = [];
                //循环图层及图形添加
                var layers = that.map.getLayers().getArray();
                layers.forEach(layeritem =>
                {
                    switch (layeritem.id)
                    {
                        case 'jiegou'://结构
                        case 'tukuai'://土块':
                        case 'shuiwei'://水位':
                            switch (that.shiqu.type)
                            {
                                case 'zuobiao':
                                    {
                                        var tempfeats = layeritem.getSource().getFeatures();
                                        tempfeats.forEach(feat =>
                                        {
                                            //根据图形类型判断是否可以添加中点
                                            switch (feat.getGeometry().getType())
                                            {
                                                case 'Point':
                                                    feats.push(feat);
                                                    break;
                                                case 'LineString':
                                                    {
                                                        var co = feat.getGeometry().getCoordinates();

                                                        //从第0个点开始计算中点
                                                        for (var i = 0; i < co.length; i++)
                                                        {
                                                            feats.push(new ol.Feature(new ol.geom.Point(co[i])));
                                                        }
                                                    }
                                                    break;
                                                case 'Polygon':
                                                    {
                                                        var cop = feat.getGeometry().getCoordinates();
                                                        cop.forEach(item =>
                                                        {
                                                            var co = item;
                                                            //从第0个点开始计算中点
                                                            for (var i = 0; i < co.length; i++)
                                                            {
                                                                feats.push(new ol.Feature(new ol.geom.Point(co[i])));
                                                            }
                                                        });

                                                    }
                                                    break;
                                            }
                                        });
                                    }
                                    break;
                                case 'tuxing':
                                    break;
                            }

                            break;
                    }
                });

                that.shiqu.layer.getSource().addFeatures(feats);

                //添加点击事件
                that.map.on("singleclick", that.shiqu.click);
            },
            end: function ()
            {
                //取消点击事件
                that.map.un('singleclick', that.shiqu_click);
                //清空拾取图层
                that.shiqu.layer.getSource().clear();
                //取消反馈方法
                that.shiqu.event_clickget = null;
            },
            //通过此方法开启拾取
            do: function (type, callback)
            {
                that.shiqu.type = type;
                that.shiqu.event_clickget = callback;
                that.modelChange('shiqu');
            },
            //点击事件
            click: function (e)
            {
                var result = null;
                var feature = that.map.forEachFeatureAtPixel(
                    e.pixel,
                    (feature, layer) =>
                    {
                        return feature;
                    }
                );
                if (feature != undefined)
                {
                    switch (that.shiqu.type)
                    {
                        case 'zuobiao':
                            {
                                switch (feature.getGeometry().getType())
                                {
                                    case 'Point':
                                        result = feature.getGeometry().getCoordinates();
                                        break;
                                }
                            }
                            break;
                        case 'tuxing':
                            {
                                result = feature;
                            }
                            break;
                    }
                    if (result != null && that.shiqu.event_clickget != null)
                    {
                        that.shiqu.event_clickget(result);
                    }
                }
            },
        },
        //导入
        daoru: {

            //导入模式中用于选中的操作控件
            interaction_select: null,
            //导入
            start: function ()
            {
                //that.active_layer = that.layer.getByID('daoru');

                //选中操作后的样式变更及支持多选
                that.daoru.interaction_select = new ol.interaction.Select({
                    style: function (feature)
                    {

                        //保持原有样式画虚线
                        // var tempstyle = that.layer.getByFeature(feature).getStyle()(feature);
                        // tempstyle.getStroke().setLineDash([5, 5]);

                        var tempstyle = selectTextStyle.clone();
                        var name = feature.name;
                        if (name != null && name != undefined)
                        {
                            tempstyle.getText().setText("" + name + "");
                        }
                        return tempstyle;
                    },
                    multi: true,
                });

                that.daoru.interaction_select.on('select', function ()
                {
                    //判断选中项是否为当前layer
                    var features = that.daoru.interaction_select.getFeatures().getArray();
                    for (var i = 0; i < features.length; i++)
                    {
                        //features[i].setStyle(null);
                        if (that.active_layer != that.layer.getByFeature(features[i]))
                        {
                            //移除不属于当前图层的图形
                            that.daoru.interaction_select.getFeatures().removeAt(i);
                        }
                    }
                    // //触发页面显示变化
                    // if (that.select.event_feature_co_changed != null)
                    // {
                    //     that.select.event_feature_co_changed();
                    // }
                });
                that.map.addInteraction(that.daoru.interaction_select);
            },
            end: function ()
            {
                //that.active_layer = that.layer.getByID('jiegou');
                that.map.removeInteraction(that.daoru.interaction_select);

            },
            //清理层数据
            clear: function ()
            {
                that.active_layer.getSource().clear();
                that.daoru.interaction_select.getFeatures().clear();
            },

            //将选中图形导入指定图层
            importFeatures: function (layerid)
            {
                var feats = that.daoru.interaction_select.getFeatures().getArray();
                var layertarget = that.layer.getByID(layerid);
                //var layersdaoru = that.layer.getByID('daoru');
                for (var i = 0; i < feats.length; i++)
                {
                    that.property.creat(feats[i]);
                    feats[i].layer_name = layertarget.name;
                    layertarget.getSource().addFeature(feats[i]);
                    that.active_layer.getSource().removeFeature(feats[i]);
                }
                that.daoru.interaction_select.getFeatures().clear();
            },

            //增加图形
            addFeature: function (feat, co)
            {
                feat.getGeometry().setCoordinates(co);
                that.undo.indo([feat], [true]);
                that.active_layer.getSource().addFeature(feat);
            },
            //===========================================================线面转换================================================
            lineStringToPolygon: function (lines)
            {
                //判断是否所有传入值都是线
                for (var i = 0; i < lines.length; i++)
                {
                    switch (lines[i].getGeometry().getType())
                    {
                        case 'Point':
                        case 'Polygon':
                            throw '只有线才能转换面';
                            break;
                        case 'LineString':
                            break;
                    }
                }
                var jiaodians = that.daoru.lineStringToPolygon_jiaodian(lines);

                if (jiaodians.length < 3)
                {
                    throw '交点个数太少，不能形成面';
                }
                var resultfeat = new ol.Feature(new ol.geom.Polygon([(jiaodians)]));//ol.coordinate.convexHull
                //格式化
                FormatFeature(resultfeat);
                //that.property.creat(resultfeat);
                return resultfeat;

            },
            //计算两条线的焦点
            lineStringToPolygon_jiaodian: function (lines)
            {
                //计算线交点
                var jiaodian = [];
                for (var i = 0; i < lines.length; i++)
                {
                    var line1 = turf.lineString(lines[i].getGeometry().getCoordinates());
                    var line2 = turf.lineString(lines[(i + 1) % lines.length].getGeometry().getCoordinates());
                    var intersects = turf.lineIntersect(line1, line2);
                    if (intersects.features.length > 0)
                    {
                        jiaodian.push(intersects.features[0].geometry.coordinates);
                    }

                }
                if (jiaodian.length > 2)
                {
                    jiaodian.push(jiaodian[0]);
                }
                return jiaodian;
            },
        },
        //===========================================================图层操作================================================
        layer: {
            //图层配置
            theme_layer: null,
            //初始化图层,根据设置
            init: function (theme_layer)
            {
                that.layer.theme_layer = theme_layer;
                var layers = [];
                var layer_temp;

                // layer_temp = that.layer.creat('selected', {
                //     "name": "选中",
                //     "opacity": 1,
                //     "visable": "true",
                //     "size": "6",
                //     "bordercolor": "#ffcd00",
                //     "fillcolor": "#ffcd00",
                //     "fillopacity": 0.5
                // });
                // layer_temp.setStyle((f) =>
                // {
                //     return new ol.style.Style({
                //         fill: new ol.style.Fill({
                //             color: '#00000000'
                //         }),
                //         stroke: new ol.style.Stroke({
                //             color: '#FFFFFFd0',
                //             width: 10
                //         })
                //     });

                // });
                // layers.push(layer_temp);

                var keys = [];

                for (let key in that.layer.theme_layer)
                {
                    keys.push(key);
                }
                for (var i = keys.length - 1; i >= 0; i--)
                {
                    var key = keys[i];
                    //enumerableKeys.push(key);
                    var layeritem = that.layer.theme_layer[key];
                    layer_temp = that.layer.creat(key, layeritem);
                    layers.push(layer_temp);
                }


                return layers;
            },

            //图层样式刷新
            theme_layer_change: function (theme_layer)
            {
                that.layer.theme_layer = theme_layer;
                that.refreshMap();
            },
            //新建图层-根据设置
            creat: function (key, layeritem)
            {

                // "name": "结构",
                // "opacity": 1,
                // "visable": "true",
                // "size": "3",
                // "bordercolor": "#768dd1",
                // "fillcolor": "#768dd1",
                // "fillopacity": 0.5
                var templayer = new ol.layer.Vector({
                    source: new ol.source.Vector({
                        features: [],
                        wrapX: false
                    }),
                    style: function (feature)
                    {
                        var style = nonTextStyle.clone();
                        if (feature.mystyle != null)
                        {
                            style.image_ = new ol.style.Circle({
                                radius: feature.mystyle.stroke_width,
                                fill: new ol.style.Fill({
                                    color: feature.mystyle.stroke_color,
                                }),
                                stroke: new ol.style.Stroke({
                                    color: [255, 255, 255, 0.75],
                                    width: 1.5
                                })
                            });
                            style.getStroke().setWidth(feature.mystyle.stroke_width);
                            style.getStroke().setColor(feature.mystyle.stroke_color);
                            style.getFill().setColor(feature.mystyle.fill_color);
                            //字体相关
                            style.getText().setFont(feature.mystyle.font_size + 'px Microsoft YaHei');
                            style.getText().getFill().setColor(feature.mystyle.font_color);
                        }
                        else
                        {
                            // userSetting.theme_layer[layeritem.id] 
                            // "bordercolor": "#768dd1",
                            // "fillcolor": "#768dd1",
                            // "fillopacity": 0.5

                            style.image_ = new ol.style.Circle({
                                radius: layeritem.size,
                                fill: new ol.style.Fill({
                                    color: that.layer.theme_layer[key].bordercolor,
                                }),
                                stroke: new ol.style.Stroke({
                                    color: [255, 255, 255, 0.75],
                                    width: 1.5
                                })
                            });
                            style.getStroke().setWidth(that.layer.theme_layer[key].size);
                            style.getStroke().setColor(that.layer.theme_layer[key].bordercolor);
                            let tmd = 1 - parseFloat(that.layer.theme_layer[key].fillopacity);
                            style.getFill().setColor(that.layer.theme_layer[key].fillcolor + that.opacity1to16(tmd));

                            //测量图层虚线
                            switch (that.layer.getByFeature(feature).id)
                            {
                                case 'celiang':
                                    style.getStroke().setLineDash(feature.lineDash);
                                    break;
                            }
                        }
                        var name = feature.name;
                        if (name != null && name != undefined)
                        {
                            style.getText().setText("" + name + "");
                        }
                        return style;
                    },
                });

                templayer.id = key;
                templayer.name = layeritem.name;
                templayer.isenable = true;
                //是否显示在页面的list中
                templayer.isshowinlist = true;
                //是否保存到工程文件
                templayer.issavefile = true;
                switch (key)
                {
                    case 'jiegou'://结构
                        //默认激活结构图层
                        that.active_layer = templayer;
                        break;
                    case 'tukuai'://土块
                        break;
                    case 'shuiwei'://水位
                        break;
                    case 'hezai'://荷载
                        break;
                    case 'biaozhu'://标注
                        break;
                    case 'daoru'://导入数据缓存':
                        templayer.isenable = true;
                        break;
                    case 'celiang'://测量
                        that.measure.layer = templayer;
                        templayer.isenable = false;
                        break;
                    case 'dingdian'://顶点编辑':
                        that.select.editpoints_layer = templayer;
                        templayer.isenable = false;
                        templayer.isshowinlist = false;
                        templayer.issavefile = false;
                        break;
                    case 'yifu'://依附':
                        that.snap.layer = templayer;
                        templayer.isenable = false;
                        templayer.isshowinlist = false;
                        break;
                    case 'chengguo'://成果渲染':
                        templayer.isenable = false;
                        templayer.issavefile = false;
                        break;
                    case 'shiqu'://拾取
                        that.shiqu.layer = templayer;
                        templayer.isenable = false;
                        templayer.isshowinlist = false;
                        templayer.issavefile = false;
                        break;
                    case 'shiquxuanran'://拾取渲染
                        templayer.isenable = false;
                        templayer.isshowinlist = false;
                        templayer.issavefile = false;
                        that.shiquxuanran.layer = templayer;
                        break;

                }

                templayer.mystyle = layeritem;
                templayer.setOpacity(layeritem.opacity);

                if (layeritem.visable == 'true')
                {
                    templayer.setVisible(true);
                }
                else
                {
                    templayer.setVisible(false);
                }
                return templayer;
            },
            //删除图层
            delete: function (ol_uid)
            {

                var layers = that.map.getLayers().getArray();

                if (layers.length == 1)
                {
                    throw ("最后一个图层不能删除");
                    return;
                }
                var r = layers.filter(function (x)
                {
                    return x.ol_uid == ol_uid;

                });
                if (r.length > 0)
                {
                    //删除指定图层
                    that.map.removeLayer(r[0]);
                    //判断删除图层是否为激活图层，如果是，则激活其他图层
                    if (r[0] == that.active_layer)
                    {
                        that.layer.active(that.map.getLayers().getArray()[0].ol_uid);
                    }
                    //删除后清空选中
                    that.select.clearSelect();
                }
            },
            //激活图层
            active: function (ol_uid)
            {
                var result = false;
                try
                {
                    var layers = that.map.getLayers().getArray();
                    var r = layers.filter(function (x)
                    {
                        return x.ol_uid == ol_uid;

                    });
                    if (r.length > 0)
                    {
                        if (!r[0].isenable)
                        {
                            throw '此图层不可编辑';
                        }
                        that.active_layer = r[0];
                    }

                    //根据操作类型，切换图层
                    that.modelChange(that.model);
                    //清空退回栈
                    that.undo.clear();
                    //清空选中
                    that.select.clearSelect();
                    result = true;
                } catch (ex)
                {

                }
                return result;
            },
            //获取图层，根据内置ID
            getByUID: function (ol_uid)
            {
                var layers = that.map.getLayers().getArray();
                var r = layers.filter(function (x)
                {
                    return x.ol_uid == ol_uid;

                });
                var result = null
                if (r.length > 0)
                {
                    result = r[0];
                }
                return result;

            },
            //获取图层，根据ID
            getByID: function (id)
            {
                var layers = that.map.getLayers().getArray();
                var r = layers.filter(function (x)
                {
                    return x.id == id;

                });
                var result = null
                if (r.length > 0)
                {
                    result = r[0];
                }
                return result;

            },
            //获取图层，根据图形
            getByFeature: function (feature)
            {
                var layers = that.map.getLayers().getArray();
                for (var i = 0; i < layers.length; i++)
                {
                    var source = layers[i].getSource();
                    if (source instanceof ol.source.Vector)
                    {
                        var features = source.getFeatures();
                        if (features.length > 0)
                        {
                            for (var j = 0; j < features.length; j++)
                            {
                                if (features[j] === feature)
                                {
                                    return layers[i];
                                }
                            }
                        }
                    }
                }
                return null;
            },
            //图层排序
            sort: function (ol_uids)
            {
                var newlayers = [];
                for (var i = 0; i < ol_uids.length; i++)
                {
                    var layer = that.layer.getByUID(ol_uids[i]);
                    newlayers.push(layer);
                }
                that.map.getLayers().clear();
                //that.map.addLayer(that.measure.layer);
                for (var i = 0; i < newlayers.length; i++)
                {
                    that.map.addLayer(newlayers[i]);
                }
            },
            //获取所有图层
            getAll: function ()
            {
                var layers_r = [];
                var layers = that.map.getLayers().getArray();
                for (var i = 0; i < layers.length; i++)
                {
                    layers_r.push(layers[i]);
                }
                return layers_r;
            },
        },

        //===========================================================拾取渲染(没有撤销)================================================
        //
        shiquxuanran: {
            //图层
            layer: null,

            //["x,y","x1,y1","x2,y2"]
            //追加坐标点集，[[0,1]]根据长度判定是点，还是线,isfit是否飞到目标位置
            append: function (co, isfit)
            {



                let feat_temp = null;
                if (co.length == 0)
                {
                    throw '没有坐标信息';
                }

                if (co.length == 1)
                {
                    //点
                    //判断当前图形是否已存在
                    if (!that.shiquxuanran.ishave(co, 'Point'))
                    {
                        feat_temp = new ol.Feature(new ol.geom.Point(co[0]));
                        that.shiquxuanran.layer.getSource().addFeature(feat_temp);
                    }
                }
                else
                {
                    //线
                    //判断当前图形是否已存在
                    if (!that.shiquxuanran.ishave(co, 'LineString'))
                    {
                        feat_temp = new ol.Feature(new ol.geom.LineString(co));
                        that.shiquxuanran.layer.getSource().addFeature(feat_temp);
                    }
                }
                if (feat_temp != null && isfit)
                {
                    that.map.getView().fit(feat_temp.getGeometry().getExtent());
                }
            },
            //判断当前否存在
            ishave: function (co, type)
            {
                let result = false;
                let feats = that.shiquxuanran.layer.getSource().getFeatures();
                for (let i = 0; i < feats.length; i++)
                {
                    if (feats[i].getGeometry().getType() == type)
                    {
                        if (feats[i].getGeometry().getCoordinates().toString() == co.toString())
                        {
                            result = true;
                            break;
                        }
                    }
                }
                return result;
            },
            //清理事件
            clear: function ()
            {
                that.shiquxuanran.layer.getSource().clear();
            },
        },
        //===========================================================吸附相关================================================
        snap: {
            //吸附图层
            layer: null,
            show: function ()
            {
                //根据同层添加
                var feats = new ol.Collection();
                var layers = that.map.getLayers().getArray();
                layers.forEach(layeritem =>
                {
                    switch (layeritem.id)
                    {
                        case 'jiegou'://结构
                        case 'tukuai'://土块':
                        case 'shuiwei'://水位':
                            var tempfeats = layeritem.getSource().getFeatures();
                            tempfeats.forEach(feat =>
                            {

                                //根据图形类型判断是否可以添加中点
                                switch (feat.getGeometry().getType())
                                {
                                    case 'Point':
                                        feats.push(feat);
                                        break;
                                    case 'LineString':
                                        {
                                            var co = feat.getGeometry().getCoordinates();

                                            feats.push(new ol.Feature(new ol.geom.Point(co[0])));
                                            //从第2个点开始计算中点
                                            for (var i = 1; i < co.length; i++)
                                            {
                                                feats.push(new ol.Feature(new ol.geom.Point(co[i])));
                                                //线段中点
                                                feats.push(that.snap.getMiddlePoint(co[i - 1], co[i]));
                                            }
                                        }
                                        break;
                                    case 'Polygon':
                                        {
                                            var cop = feat.getGeometry().getCoordinates();
                                            cop.forEach(item =>
                                            {
                                                var co = item;

                                                //feats.push(new ol.Feature(new ol.geom.Point(co[0])));
                                                //从第2个点开始计算中点
                                                for (var i = 1; i < co.length; i++)
                                                {
                                                    feats.push(new ol.Feature(new ol.geom.Point(co[i])));
                                                    //线段中点
                                                    feats.push(that.snap.getMiddlePoint(co[i - 1], co[i]));
                                                }
                                            });

                                        }
                                        break;
                                }
                            });

                            break;
                    }
                });

                var snap = new ol.interaction.Snap({
                    pixelTolerance: 10,//吸附距离
                    features: feats,
                    edge: false,//边
                    vertex: true//点
                });
                that.map.addInteraction(snap);
            },
            //根据两个点的坐标 创建中间点
            getMiddlePoint(point1, point2)
            {
                var x = (point1[0] + point2[0]) / 2;
                var y = (point1[1] + point2[1]) / 2;
                var feat = new ol.Feature(new ol.geom.Point([x, y]));
                FormatFeature(feat);
                //feat.name = feat.getGeometry().getCoordinates() + "";
                that.snap.layer.getSource().addFeature(feat);
                return feat;
            },

            hide: function ()
            {
                that.map.getInteractions().forEach(function (element, index, array)
                {
                    if (element instanceof ol.interaction.Snap)
                    {
                        try
                        {
                            that.map.removeInteraction(element);
                        } catch (ex) { }
                    }
                });
                //清理所有点
                that.snap.layer.getSource().clear();

            },

        },

        //===========================================================属性操作================================================
        property: {
            creat: function (feature)
            {
                var sx = {};
                switch (feature.getGeometry().getType())
                {
                    case "Point":
                        sx.name = "点" + that.active_layer.getSource().getFeatures().length;
                        break;
                    case "LineString":
                        sx.name = "线" + that.active_layer.getSource().getFeatures().length;
                        break;
                    case "Polygon":
                        sx.name = "面" + that.active_layer.getSource().getFeatures().length;
                        break;
                }
                sx.name += "(" + that.active_layer.name + ")";
                sx.lx = '0';
                sx.layer_name = that.active_layer.name;
                sx.sx1 = that.active_layer.getSource().getFeatures().length;
                sx.sx2 = "属性2-" + that.active_layer.getSource().getFeatures().length;
                sx.mystyle = null;
                that.property.set(feature, sx);
            },
            set: function (feature, atr)
            {
                if (atr == null)
                {
                    feature.name = '';
                    feature.layer_name = '';
                    feature.lx = '';
                    feature.sx1 = '';
                    feature.sx2 = '';
                    feature.mystyle = null;
                }
                else
                {
                    if (atr.name != null)
                    {
                        feature.name = atr.name;
                    }
                    if (atr.layer_name != null)
                    {
                        feature.layer_name = atr.layer_name;
                    }
                    if (atr.lx != null)
                    {
                        feature.lx = atr.lx;
                    }
                    if (atr.sx1 != null)
                    {
                        feature.sx1 = atr.sx1;
                    }
                    if (atr.sx1 != null)
                    {
                        feature.sx2 = atr.sx2;
                    }
                    if (atr.mystyle && atr.mystyle != null)
                    {
                        feature.mystyle = atr.mystyle;
                    }
                }
            },
            getForJSON: function (feature)
            {
                //获取属性
                var sx = {};
                sx.name = feature.name;
                sx.layer_name = feature.layer_name;
                sx.lx = feature.lx;
                sx.sx1 = feature.sx1;
                sx.sx2 = feature.sx2;
                sx.mystyle = feature.mystyle;
                return sx;
            },
            copyall: function (sourceFeature, targetFeature)
            {
                targetFeature.name = sourceFeature.name;
                targetFeature.layer_name = sourceFeature.layer_name;
                targetFeature.lx = sourceFeature.lx;
                targetFeature.sx1 = sourceFeature.sx1;
                targetFeature.sx2 = sourceFeature.sx2;
                targetFeature.mystyle = sourceFeature.mystyle;
                targetFeature.changed();
            },
            //属性刷粘贴,只刷业务属性
            paset: function (sourceFeature, targetFeature)
            {
                //以更新模式进入撤回栈
                that.undo.indo([targetFeature], [false]);
                targetFeature.name = sourceFeature.name;
                targetFeature.layer_name = sourceFeature.layer_name;
                targetFeature.lx = sourceFeature.lx;
                targetFeature.sx1 = sourceFeature.sx1;
                targetFeature.sx2 = sourceFeature.sx2;
                targetFeature.changed();
            }
        },

        //===========================================================图形相关操作================================================
        feature: {
            //复制图形，主要用于规范属性
            getNewFeatureWithPropertyByFeature: function (feature)
            {
                var new_feature = feature.clone();
                that.property.copyall(feature, new_feature);
                return new_feature
            },
            //获取数据集
            getCoByFeature: function (feat)
            {
                return feat.getGeometry().getCoordinates();
            },
            //修改图形的坐标点集
            updataFeatureCo: function (feat, co)
            {
                that.undo.indo([feat], [false]);
                feat.getGeometry().setCoordinates(co);
                FormatFeature(feat);
            },

            //获取线图形长度--米
            getFeatureLength: function (feat)
            {
                //长度计算
                var length = feat.getGeometry().getLength();
                return length;
            },
            //获取面图形面积--平方米
            getFeatureArea: function (feat)
            {
                var area = feat.getGeometry().getArea();
                return area;
            },
            //获取面图形周长--米
            getFeaturePerimeter: function (feat)
            {
                var sco = feat.getGeometry().getCoordinates();
                var tco = [];
                sco.forEach(Lineitem =>
                {
                    Lineitem.forEach(pointitem =>
                    {
                        tco.push(pointitem);
                    });
                });
                var tempfeat = new ol.geom.LineString(tco);
                var length = tempfeat.getLength();
                return length;
            },
        },

        //刷新地图
        refreshMap: function ()
        {
            that.map.render();
        },
        //清空当前数据用于重新开始
        ClearAll: function ()
        {
            //删除图层 --当前激活图层，测量图层 删除图形
            //当前激活图层修改为默认名称
            var layers = that.map.getLayers().getArray();
            for (var i = 0; i < layers.length; i++)
            {
                if (layers[i] == that.active_layer)
                {
                    layers[i].name = "图层0";
                }
                else if (layers[i] == that.measure.layer)
                {
                }
                else
                {
                    that.map.removeLayer(layers[i]);
                }
            }
            that.active_layer.getSource().clear();
            that.measure_clear();

        },

        //获取图形的JSON
        GetGeoJSON: function ()
        {
            var solution = {};
            //中心点与缩放级别
            var mapExtent = that.map.getView().calculateExtent(that.map.getSize());
            var map_center = ol.extent.getCenter(mapExtent);
            solution.center = [parseFloat(map_center[0]).toFixed(4), parseFloat(map_center[1]).toFixed(4)];
            solution.zoom = that.map.getView().getZoom();
            //图层及图形
            solution.layers = [];
            var layers = that.map.getLayers().getArray();

            for (var i = 0; i < layers.length; i++)
            {
                var layermodel = {};
                //id
                layermodel.id = layers[i].id;
                //名称
                layermodel.name = layers[i].name;
                //显隐
                layermodel.visible = layers[i].getVisible();
                //是否可操作
                layermodel.isenable = layers[i].isenable;
                //样式
                layermodel.mystyle = layers[i].mystyle;


                //图形及属性
                //图形集合
                var newfeatures = [];
                //属性集合
                var newsxs = [];
                var vectorSource = layers[i].getSource();
                //根据类型判断是否需要保存图形
                if (layers[i].issavefile)
                {
                    vectorSource.forEachFeature(function (feature)
                    {
                        //获取图形
                        var clone = feature.clone();
                        clone.setId(feature.getId());  // clone does not set the id
                        clone.getGeometry();
                        newfeatures.push(clone);
                        //获取属性
                        var sx = that.property.getForJSON(feature);
                        newsxs.push(sx);

                    });
                }
                //图形集合序列化
                var string = new ol.format.GeoJSON().writeFeatures(newfeatures, {
                    //featureProjection: that.map.getView().getProjection()
                });
                layermodel.source = string;
                layermodel.sx = newsxs;
                solution.layers.push(layermodel);
            }
            return solution;
        },
        //加载图形的JSON
        SetGeoJSON: function (json, callback)
        {

            while (that.map.getLayers().getArray().length > 0)
            {
                that.map.getLayers().removeAt(0);
            }

            //图层及图形
            var layers = json.layers;
            var layer_new = null;
            var layer_json = null;

            //标准图层
            var keys = [];
            //反序
            for (let key in that.layer.theme_layer)
            {
                keys.push(key);
            }
            for (var i = keys.length - 1; i >= 0; i--)
            {
                var key = keys[i];
                //如果能在工程文件中找到则用工程文件，如果不行，则用默认配置
                var temparray = json.layers.filter((item) =>
                {
                    return item.id == key;
                });
                //默认配置
                if (temparray.length == 0)
                {
                    //enumerableKeys.push(key);
                    var layeritem = that.layer.theme_layer[key];
                    layer_new = that.layer.creat(key, layeritem);
                }
                else
                {
                    layer_json = temparray[0];
                    layer_new = that.layer.creat(layer_json.id, layer_json.mystyle);
                    //显隐
                    layer_new.setVisible(layer_json.visible);
                    //是否可操作
                    layer_new.isenable = layer_json.isenable;
                    if (layer_json.source != null)
                    {
                        //图形反序列化
                        var feats = (new ol.format.GeoJSON()).readFeatures(layer_json.source);
                        var sxs = layer_json.sx;
                        //添加图形
                        for (var j = 0; j < feats.length; j++)
                        {
                            var fe = feats[j];
                            that.property.set(fe, sxs[j]);
                            layer_new.getSource().addFeature(fe);
                        }
                    }
                }
                that.map.addLayer(layer_new);
            }


            // for (var i = 0; i < layers.length; i++)
            // {
            //     layer_new = that.layer.creat(layers[i].id, layers[i].mystyle);
            //     //显隐
            //     layer_new.setVisible(layers[i].visible);
            //     //是否可操作
            //     layer_new.isenable = layers[i].isenable;
            //     if (layers[i].source != null)
            //     {
            //         //图形反序列化
            //         var feats = (new ol.format.GeoJSON()).readFeatures(layers[i].source);
            //         var sxs = layers[i].sx;
            //         //添加图形
            //         for (var j = 0; j < feats.length; j++)
            //         {
            //             var fe = feats[j];
            //             that.property.set(fe, sxs[j]);
            //             layer_new.getSource().addFeature(fe);
            //         }
            //     }
            //     that.map.addLayer(layer_new);
            // }

            //设定激活层
            that.active_layer = that.layer.getByID('jiegou');
            ////设置中心点与缩放
            //that.map.getView().setCenter(json.center);
            //that.map.getView().setZoom(json.zoom);
            callback();

        },
        //增加图形
        AddGeo: function (jsonstring)
        {

            //图形反序列化
            var feats = (new ol.format.GeoJSON()).readFeatures(jsonstring);
            //添加图形
            for (var j = 0; j < feats.length; j++)
            {
                var fe = feats[j];
                fe.name = "";
                fe.layer_name = that.active_layer.name;
                fe.lx = "";
                fe.sx1 = "";
                fe.sx2 = "";
                fe.mystyle = null;
                FormatFeature(fe);
                that.active_layer.getSource().addFeature(fe);
            }
        },

        //导出图片
        outputPNG: function (callback)
        {
            var canvas = that.canvas;
            //if (navigator.msSaveBlob) {
            //    navigator.msSaveBlob(canvas.msToBlob(), 'map.png');
            //} else {

            var imageData = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
            // for (var i = 0; i < imageData.data.length; i += 4) {
            //     // 当该像素是透明的，则设置成白色
            //     if (imageData.data[i + 3] == 0) {
            //         imageData.data[i] = 0;
            //         imageData.data[i + 1] = 0;
            //         imageData.data[i + 2] = 0;
            //         imageData.data[i + 3] = 255;
            //     }
            // }
            //canvas.getContext("2d").putImageData(imageData, 0, 0);
            //var img = canvas.toDataURL("image/jpeg");
            //img = img.substring(img.indexOf(',') + 1);
            //for (var i = 0; i < imageData.data.length; i += 4) {
            //    // 当该像素是白色的，则设置成透明
            //    if (imageData.data[i] == 255) {
            //        imageData.data[i] = 0;
            //        imageData.data[i + 1] = 0;
            //        imageData.data[i + 2] = 0;
            //        imageData.data[i + 3] = 0;
            //    }
            //}
            canvas.getContext("2d").putImageData(imageData, 0, 0);

            canvas.toBlob(function (blob)
            {
                var reader = new FileReader();
                reader.readAsDataURL(blob);//调用自带方法进行转换 
                reader.onload = function (e)
                {

                    //此时this.result = data:image/png;base64,iVBORw0KGgoA这种
                    callback(this.result);

                };
                //将Blob 对象转换成字符串
                //var reader = new FileReader();
                //reader.readAsText(blob, 'utf-8');
                //reader.onload = function (e) {

                //    //console.info(reader.result);
                //    callback(reader.result);
                //}
                //var filename = "map.png";
                //const link = document.createElement("a");
                //const body = document.querySelector("body");
                //link.href = window.URL.createObjectURL(blob); // 创建对象url
                //link.download = filename;
                //link.style.display = "none";
                //body.appendChild(link);
                //link.click();
                //body.removeChild(link);
                //window.URL.revokeObjectURL(link.href); // 通过调用 URL.createObjectURL() 创建的 URL 对象
            });
            //}
        },
        //检查输入是否符合坐标标准，为数字最多四位小数
        checkzb: function (zb)
        {
            var result = true;
            var reg_zb = /^(-)?([1-9]{1}[0-9]{0,}|0)(\.[0-9]{1,4})?$/;
            if (!reg_zb.test(zb))
            {
                result = false;
            }
            return result;
        },
        //根据时间获取tik用于不重复的数字串
        getTik: function ()
        {
            var tik = +new Date() + '';
            return tik;
        },

        //不透明度，16进制转0-1
        opacity16to1(ff)
        {
            let op = 1;
            let tmd = parseInt(ff, 16);
            tmd = tmd / 255;
            tmd = tmd;
            op = parseFloat(tmd.toFixed(1));
            return op;
        },
        //不透明度，0-1进制转16
        opacity1to16(op)
        {
            let ff = 'ff';
            let tmd = parseFloat(op);
            tmd = tmd * 255;
            tmd = tmd.toFixed(0);
            tmd = parseInt(tmd);
            ff = tmd.toString(16).toUpperCase(0);
            return ff;
        },
    };
    return that;
})();
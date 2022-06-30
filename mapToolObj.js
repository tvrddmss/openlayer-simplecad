var mapToolObj = (function ()
{
    'use strict';
    var that = {



        //此闭环是否包含闭环集合某个闭环-----判定某个闭环，在此闭环内,---如果有，返回true,如果没则返回false
        bhs_bool_contains_booleanContains: function (bh, bhs)
        {
            for (let i = 0; i < bhs.length; i++)
            {
                let co_i = bhs[i];
                let turf_polygon_i = turf.polygon([co_i], {});


                var turf_polygon_bh = turf.polygon([bh], {});

                if (turf.booleanContains(turf_polygon_bh, turf_polygon_i))
                {
                    return true;
                }
            }
            return false;
        },

        //闭环集合中是否有闭环包含此闭环-----判定此闭环，在某个闭环内,---如果有，返回被包含的闭环的index,没有返回null
        bhs_index_contains_booleanContains: function (bhs, bh)
        {
            for (let i = 0; i < bhs.length; i++)
            {
                let co_i = bhs[i];
                let turf_polygon_i = turf.polygon([co_i], {});


                var turf_polygon_bh = turf.polygon([bh], {});

                if (turf.booleanContains(turf_polygon_i, turf_polygon_bh))
                {
                    return i;
                }
            }
            return null;
        },


        //闭环集合中是否包含此闭环-----判定坐标相同
        bhs_bool_contains: function (bhs, bh)
        {
            for (let i = 0; i < bhs.length; i++)
            {
                let co_i = bhs[i];
                let turf_polygon_i = turf.polygon([co_i], {});

                let co_j = bh;
                let turf_polygon_j = turf.polygon([co_j], {});
                if (turf.booleanEqual(turf_polygon_i, turf_polygon_j))
                {
                    return true;
                }
            }
            return false;
        },

        //设置闭环的开始与结束一致
        bh_format: function (bh)
        {
            bh[bh.length - 1][0] = bh[0][0];
            bh[bh.length - 1][1] = bh[0][1];
        },


        //包含此点的线的集合,传入的index的线除外
        lines_co_lines_containsco_withoutindex: function (lines, co, currentlines)
        {

            let newlines = lines.filter(v => !currentlines.some((item) => item === v));

            let linesnew = [];
            for (let i = 0; i < newlines.length; i++)
            {

                if (that.co_bool_same(newlines[i].getGeometry().getCoordinates()[0], co)
                    || that.co_bool_same(newlines[i].getGeometry().getCoordinates()[1], co))
                {
                    linesnew.push(newlines[i]);
                }
            }
            return linesnew;

        },


        //计算两条线的交点，包含首尾点，如果有返回，如果没有返回null
        lineArray_co_jiaodian: function (lines)
        {
            let result = null;
            let line1 = turf.lineString(lines[0].getGeometry().getCoordinates());
            let line2 = turf.lineString(lines[1].getGeometry().getCoordinates());
            let intersects = turf.lineIntersect(line1, line2);
            if (intersects.features.length > 0)
            {
                result = intersects.features[0].geometry.coordinates;
            }
            else
            {
                //如果没计算出交点，判定是否首尾相连

                if (that.co_bool_same(lines[0].getGeometry().getCoordinates()[0], lines[1].getGeometry().getCoordinates()[0])
                    || that.co_bool_same(lines[0].getGeometry().getCoordinates()[0], lines[1].getGeometry().getCoordinates()[1]))
                {
                    result = lines[0].getGeometry().getCoordinates()[0];
                } else if (that.co_bool_same(lines[0].getGeometry().getCoordinates()[1], lines[1].getGeometry().getCoordinates()[0])
                    || that.co_bool_same(lines[0].getGeometry().getCoordinates()[1], lines[1].getGeometry().getCoordinates()[1]))
                {
                    result = lines[0].getGeometry().getCoordinates()[1];
                }
            }

            return result;
        },

        //坐标集合中去除此点坐标
        co_array_ArrayRemove: function (cos, co)
        {
            let cosnew = [];
            for (let i = 0; i < cos.length; i++)
            {
                let item = cos[i];
                if (!that.co_bool_same(item, co))
                {
                    cosnew.push(item);
                }
            }
            return cosnew;
        },


        //坐标集合的集合中是否包含此点坐标
        co_bool_ArrayArrayContains: function (coss, co)
        {
            let result = coss.filter(item =>
            {
                return that.co_bool_ArrayContains(item, co);
            });
            if (result.length > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        },
        //坐标集合中是否包含此点坐标
        co_bool_ArrayContains: function (cos, co)
        {
            let result = false;
            for (let i = 0; i < cos.length; i++)
            {
                let item = cos[i];
                if (that.co_bool_same(item, co))
                {
                    result = true;
                    break;
                }
            }
            return result;
        },


        //判定两个坐标是否坐标一致
        co_bool_same: function (co1, co2)
        {
            if (co1[0].toFixed(4) == co2[0].toFixed(4)
                && co1[1].toFixed(4) == co2[1].toFixed(4))
            {
                return true;
            }
            else
            {
                return false;
            }
        },

        //坐标截至到6位小数---为了精确计算，同时又不会成为两个点
        co_co_format_6: function (co)
        {
            co[0] = parseFloat(co[0].toFixed(6));
            co[1] = parseFloat(co[1].toFixed(6));
            return co;
        }

    };
    return that;
})();

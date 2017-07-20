function CIRCLESformsWATCHFORMULAclose() { return YES ; }
function CIRCLESformsWATCHFORMULAmain( _base_id, _move, index, _items_switch )
{
    if ( is_string( index ) ) index = circles_lib_find_item_index_by_symbol( null, index ) ;
    var _chunk = circles_lib_items_set( _items_switch, YES ) ;
    var _items_n = _chunk['count'], _items_array = _chunk['array'], _caption = _chunk['label'], _items_switch = _chunk['switch'] ;
    CIRCLESformsWATCHFORMULAbaseid = safe_string( _base_id, "" ) ;
    _move = safe_int( _move, YES ), _index = safe_int( index, UNFOUND );
    if ( index != UNFOUND )
    {
       var ITEM = _items_array[index] ;
       if ( !is_item_obj( ITEM ) ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, "Archive error.", _glob_app );
       else
       {
          var _symbol = ITEM.symbol.length > 0 ? ITEM.symbol : "< unknown >" ;
          var _mm = ITEM.map, bISNULL = is_mobius_map( _mm ) ? NO : YES ;
          var A = ITEM.map.get_a();  var A_formula = circles_lib_math_parse_formula( A.formula() );
          var B = ITEM.map.get_b();  var B_formula = circles_lib_math_parse_formula( B.formula() );
          var C = ITEM.map.get_c();  var C_formula = circles_lib_math_parse_formula( C.formula() );
          var D = ITEM.map.get_d();  var D_formula = circles_lib_math_parse_formula( D.formula() );

          var WIDTH = 400, HEIGHT = "auto", _subset = "forms" ;
          var _div_id = CIRCLESformsWATCHFORMULAdiv_id = circles_lib_popup_build_divid( _subset, _base_id );
          var _caption = CIRCLESformsWATCHFORMULAcaption + " ( Symbol "+_symbol+" )" ;
          var CLOSE_FN = "CIRCLESformsWATCHFORMULAclose();" ;
          var HTMLcode = "<table WIDTH=\""+WIDTH+"\">" ;
              HTMLcode += circles_lib_popup_caption_code( YES, _caption, 1, YES, CLOSE_FN, WIDTH, HEIGHT, arguments.callee.name, _base_id, _div_id, _subset );
              HTMLcode += "<tr>" ;
              HTMLcode += "<td VALIGN=\"top\">" ;
              HTMLcode += "<table ALIGN=\"center\">" ;

          if ( !bISNULL )
          {
             var numerator = ( A.radius() > 0 ? ( "("+A_formula+")z " ) : "" )+( B.radius() > 0 ? ( A.radius() > 0 ? "+" : "" ) + B_formula : "" );
             // these two arrays have the same cardinality, thus replacements follow the same index
             var _replaceSRC = [ "+-", "-+", "--", "++", "(i)", "(1)" ] ;
             var _replaceDEST = [ "-", "-", "+", "+", "i", "" ] ;
             numerator = numerator.replaceAll( _replaceSRC, _replaceDEST );
             var MAX = 6 ;
             var FONTSIZE = ( A_formula.length > MAX || B_formula.length > MAX || C_formula.length > MAX || D_formula.length > MAX ) ? 8 : 24 ;
             HTMLcode += "<tr><td HEIGHT=\"24\" VALIGN=\"middle\" ALIGN=\"center\" STYLE=\"font-size:"+FONTSIZE+"pt;\">"+numerator+"</td></tr>" ;
             if ( ( C.radius() > 0 ) || ( D.radius() > 0 && D.radius() != 1 ) )
             {
                var denominator = ( C.radius() > 0 ? ( "("+C_formula+")z " ) : "" )+( D.radius() > 0 ? ( C.radius() > 0 ? "+" : "" ) + D_formula : "" );
                denominator = denominator.replaceAll( _replaceSRC, _replaceDEST );
                HTMLcode += "<tr><td STYLE=\"background-color:black;\" HEIGHT=\"1\"></td></tr>" ;
                HTMLcode += "<tr><td HEIGHT=\"24\" VALIGN=\"middle\" ALIGN=\"center\" STYLE=\"font-size:"+FONTSIZE+"pt;\">"+denominator+"</td></tr>" ;
             }
          }
          else HTMLcode += "<tr><td ALIGN=\"center\" STYLE=\"color:"+DEFAULT_COLOR_ERROR+";\">No formula available: all params are still set to zero</td></tr>" ;

          HTMLcode += "</table>" ;
          HTMLcode += "</td>" ;
          HTMLcode += "</tr>" ;

          HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
          HTMLcode += "<tr>" ;
          HTMLcode += "<td COLSPAN=\"3\" VALIGN=\"top\" CLASS=\"popup_buttons_bar\">" ;
          HTMLcode += "<table>" ;
          HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
          HTMLcode += "<tr>" ;
          HTMLcode += "<td WIDTH=\"5\"></td>" ;
          HTMLcode += "<td CLASS=\"link\" VALUE=\"List\" ONCLICK=\"javascript:circles_lib_popup_load('forms','seeds.list',NO,"+index+");\"></td>" ;
          HTMLcode += "<td WIDTH=\"5\"></td>" ;
          HTMLcode += "<td CLASS=\"link\" VALUE=\"Edit\" ONCLICK=\"javascript:circles_lib_popup_load('forms','edit.disk',NO,"+index+");\"></td>" ;
          HTMLcode += "</tr>" ;
          HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
          HTMLcode += "</table>" ;
          HTMLcode += "</td>" ;
          HTMLcode += "</tr>" ;

          HTMLcode += "</table>" ;
          HTMLcode = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );

          var _div = circles_lib_popup_create( _base_id, _div_id, _subset, WIDTH, HEIGHT, HTMLcode );
          if ( _move && _div != null ) move_div( _div.id, "CENTER", "TOP" );
          circles_lib_popup_activate( NO, _base_id, arguments.callee.name, arguments, _subset, OPEN, _div_id, _caption, CLOSE_FN );
       }
    }
    else circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, "Coordinates are not consistent with archived data", _glob_app );
}
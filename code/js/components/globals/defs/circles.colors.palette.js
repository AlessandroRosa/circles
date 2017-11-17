var def_clrs_tags = [], def_clrs_tags_keys = [] ;
    def_clrs_tags['tag.aqua'] = def_clrs_tags['tag.aquamarine'] = "#70DB93" ;
    def_clrs_tags['tag.banana'] = "#E3CF57" ;
    def_clrs_tags['tag.beige'] = "#F5F5DC" ;
    def_clrs_tags['tag.black'] = "#000000" ;
    def_clrs_tags['tag.bisque'] = "#FFE4C4" ;
    def_clrs_tags['tag.blue'] = "#0000FF" ;
    def_clrs_tags['tag.blueviolet'] = "#8A2BE2" ;
    def_clrs_tags['tag.brown'] = "#A52A2A" ;
    def_clrs_tags['tag.brick'] = "#9C661F" ;
    def_clrs_tags['tag.cadetblue'] = "#5F9EA0" ;
    def_clrs_tags['tag.carrot'] = "#ED9121" ;
    def_clrs_tags['tag.chocolate'] = "#D2691E" ;
    def_clrs_tags['tag.cobalt'] = "#3D59AB" ;
    def_clrs_tags['tag.coral'] = "#FF7F50" ;
    def_clrs_tags['tag.cornsilk'] = "#FFF8DC" ;
    def_clrs_tags['tag.cyan'] = "#00FFFF" ;
    def_clrs_tags['tag.darkblue'] = "#00008B" ;
    def_clrs_tags['tag.darkgray'] = "#545454" ;
    def_clrs_tags['tag.dodgerblue'] = "#1E90FF" ;
    def_clrs_tags['tag.emerald'] = "#00C957" ;
    def_clrs_tags['tag.firebrick'] = "#B22222" ;
    def_clrs_tags['tag.forest'] = "#228B22" ;
    def_clrs_tags['tag.fuchsia'] = "#FF00FF" ;
    def_clrs_tags['tag.gold'] = "#FFD700" ;
    def_clrs_tags['tag.goldenrod'] = "#DAA520" ;
    def_clrs_tags['tag.gray'] = "#A8A8A8" ;
    def_clrs_tags['tag.green'] = "#00FF00" ;
    def_clrs_tags['tag.greenshock'] = "#3EFF00" ;
    def_clrs_tags['tag.greenyellow'] = "#ADFF2F" ;
    def_clrs_tags['tag.khaki'] = "#F0E68C" ;
    def_clrs_tags['tag.indigo'] = "#4B0082" ;
    def_clrs_tags['tag.ivory'] = "#FFFFF0" ;
    def_clrs_tags['tag.lavender'] = "#E6E6FA" ;
    def_clrs_tags['tag.lemon'] = "#FFFACD" ;
    def_clrs_tags['tag.lightblue'] = "#BFEFFF" ;
    def_clrs_tags['tag.lightgreen'] = "#90EE90" ;
    def_clrs_tags['tag.lightgray'] = "#D3D3D3" ;
    def_clrs_tags['tag.lightpink'] = "#FFAEB9" ;
    def_clrs_tags['tag.lime'] = "#32CD32" ;
    def_clrs_tags['tag.magenta'] = "#FF00FF" ;
    def_clrs_tags['tag.maroon'] = "#B03060" ;
    def_clrs_tags['tag.mint'] = "#BDFCC9" ;
    def_clrs_tags['tag.moccasin'] = "#FFE4B5" ;
    def_clrs_tags['tag.navy'] = "#000080" ;
    def_clrs_tags['tag.olive'] = "#808000" ;
    def_clrs_tags['tag.orange'] = "#FFA500" ;
    def_clrs_tags['tag.orchid'] = "#DA70D6" ;
    def_clrs_tags['tag.palegreen'] = "#98FB98" ;
    def_clrs_tags['tag.papaya'] = "#FFEFD5" ;
    def_clrs_tags['tag.peacock'] = "#33A1C9" ;
    def_clrs_tags['tag.pink'] = "#FFC0CB" ;
    def_clrs_tags['tag.plum'] = "#FFBBFF" ;
    def_clrs_tags['tag.purple'] = "#A020F0" ;
    def_clrs_tags['tag.quartz'] = "#D9D9F3" ;
    def_clrs_tags['tag.red'] = "#FF0000" ;
    def_clrs_tags['tag.rederror'] = "#F03E3E" ;
    def_clrs_tags['tag.royalblue'] = "#4169E1" ;
    def_clrs_tags['tag.salmon'] = "#FA8072" ;
    def_clrs_tags['tag.scarlet'] = "#8C1717" ;
    def_clrs_tags['tag.sepia'] = "#5E2612" ;
    def_clrs_tags['tag.sienna'] = "#A0522D" ;
    def_clrs_tags['tag.silver'] = "#C0C0C0" ;
    def_clrs_tags['tag.skyblue'] = "#87CEFF" ;
    def_clrs_tags['tag.slateblue'] = "#6A5ACD" ;
    def_clrs_tags['tag.slategray'] = "#708090" ;
    def_clrs_tags['tag.snow'] = "#FFFAFA" ;
    def_clrs_tags['tag.steelblue'] = "#4682B4" ;
    def_clrs_tags['tag.teal'] = "#008080" ;
    def_clrs_tags['tag.thistle'] = "#D8BFD8" ;
    def_clrs_tags['tag.turquoise'] = "#00F5FF" ;
    def_clrs_tags['tag.tomato'] = "#FF6347" ;
    def_clrs_tags['tag.transparent'] = "transparent" ;
    def_clrs_tags['tag.violet'] = "#EE82EE" ;
    def_clrs_tags['tag.violetred'] = "#FF3E96" ;
    def_clrs_tags['tag.white'] = "#FFFFFF" ;
    def_clrs_tags['tag.wheat'] = "#F5DEB3" ;
    def_clrs_tags['tag.yellow'] = "#FFFF00" ;

    def_clrs_tags['tag.advice'] = "#4F69BF" ;
    def_clrs_tags['tag.disabled'] = "#B8B8B8" ;
    def_clrs_tags['tag.error'] = "#F03E3E" ;
    def_clrs_tags['tag.info'] = "#D2D2D2" ;
    def_clrs_tags['tag.success'] = "#3ED13E" ;
    def_clrs_tags['tag.warning'] = "#FFC600;" ;

function get_rgb_from_color_tag( _colortag ) // return hex value (rgb)
{
    _colortag = safe_string( _colortag, "" ).toLowerCase();
    if ( _colortag.one_in( "#", "," ) ) return "" ; // only tags, no rgb
    else
    {
        if ( !( _colortag.includes( "tag." ) ) ) _colortag = "tag." + _colortag ;
        return def_clrs_tags[_colortag] ;
    }
}
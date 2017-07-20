function MULTISLIDERctrlACTIVATE( _slider_ctrl_id, _init_values_array, _min, _max )
{
    _min = safe_int( _min, 0 );
    _max = safe_int( _max, 100 );
    if ( !is_array( _init_values_array ) ) _init_values_array = [] ;
    
        var doUpdate = function(event, ui)
        {
            var bg = '#D6E0EB';
            $('#'+_slider_ctrl_id+' .slide-back').remove();
            $($('#'+_slider_ctrl_id+' a').get().reverse()).each(
            function(i)
            {
                $('#'+_slider_ctrl_id).append($('<div></div>').addClass('slide-back').width($(this).offset().left - 5).css('background-color', bg));
            });
        };
        
        var getVALUES = function( event, ui )
        {
            var _normalized = $('#'+_slider_ctrl_id).slider('option', 'values').clone() ;
            $.each( _normalized, function( _i,_val ) { _normalized[ _i ] /= _max ; } ) ;
            var _ranges = new Array() ;
            $.each( _normalized, function( _i, _val )
            {
                if ( _i == 0 ) _ranges.push( _val );
                else if ( _i < _normalized.length ) _ranges.push( _normalized[ _i ] - _normalized[ _i - 1 ] );
            }
            ) ;

            _ranges.push( 1.0 - _normalized[ _normalized.length - 1 ] ) ;
            CIRCLESmethodMANAGERsetVALUESfromMULTISLIDER( _ranges ) ;
        }
    
        $('#'+_slider_ctrl_id).slider({
            slide: doUpdate,
            change: doUpdate,
            stop: getVALUES,
            min: _min,
            max: _max,
            values: _init_values_array
        });
    
        doUpdate();
}
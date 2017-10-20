function circles_lib_files_open_upload_dialog( _fn, _silent, _output_channel, _multiple )
{
    _silent = safe_int( _silent, NO ), _output_channel = safe_int( _output_channel, OUTPUT_SCREEN );
    _multiple = safe_int( _multiple, 0 );
    if ( typeof _fn != "function" )
    {
        var _msg = "Sorry, but you can't load file." + _glob_crlf ;
            _msg += "Missing loading handler." ;
        if ( _output_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_CRITICAL, _msg, _glob_app_title );
        return [ RET_ERROR, _msg ] ;
    }
    else if (window.File && window.FileReader && window.FileList && window.Blob)
    {
        var files = $( '#customloader' ).get(0).files ;
        for (var i = 0, f; f = files[i]; i++)
        {
          if ( !_multiple && i == 1 ) break ;
          var reader = new FileReader();
          // Closure to capture the file information.
          reader.onload = ( function(theFile) { return function(e) { _fn.call( this, theFile.name, reader.result ); }; })(f);
          // Read in the image file as a data URL.
          reader.readAsBinaryString(f);
        }

        return [ RET_OK, "File has been opened with success" ] ;
    }
    else
    {
        var _msg = "Sorry, but you can't load file." + _glob_crlf ;
            _msg += "This browser does not support FILE READER API." ;
        if ( _output_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_CRITICAL, _msg, _glob_app_title );
        return [ RET_ERROR, _msg ] ;
    }
}
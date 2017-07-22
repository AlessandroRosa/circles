function html5_files_support() { return window.FileReader ? 1 : 0 ; }
function dirname(path)
{
    // Returns the directory name component of the path  
    // 
    // version: 1109.2015
    // discuss at: http://phpjs.org/functions/dirname    // +   original by: Ozh
    // +   improved by: XoraX (http://www.xorax.info)
    // *     example 1: dirname('/etc/passwd');
    // *     returns 1: '/etc'
    // *     example 2: dirname('c:/Temp/x');    // *     returns 2: 'c:/Temp'
    // *     example 3: dirname('/dir/test/');
    // *     returns 3: '/dir'
    return path.replace(/\\/g, '/').replace(/\/[^\/]*\/?$/, '');
}

function basename(path, suffix)
{
    // Returns the filename component of the path  
    // 
    // version: 1109.2015
    // discuss at: http://phpjs.org/functions/basename    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Ash Searle (http://hexmen.com/blog/)
    // +   improved by: Lincoln Ramsay
    // +   improved by: djmix
    // *     example 1: basename('/www/site/home.htm', '.htm');    // *     returns 1: 'home'
    // *     example 2: basename('ecra.php?p=1');
    // *     returns 2: 'ecra.php?p=1'
    var b = path.replace(/^.*[\/\\]/g, '');
     if (typeof(suffix) == 'string' && b.substr(b.length - suffix.length) == suffix) {
        b = b.substr(0, b.length - suffix.length);
    }
 
    return b;
}

function get_current_path_url()
{
    var URL = window.location.href ;
    var OUT = "" ;
        if ( URL.length > 0 )
        {
            var URLarray = URL.split( "/" );
            if ( URLarray.length > 0 )
            {
                for ( var i = 0 ; i < ( URLarray.length - 1 ) ; i++ ) OUT += URLarray[ i ] + "/" ;
                return OUT ;
            }
            else return false ;
        }
        else return false ;
}

function check_file_exists( _url )
{
    var xhr = new XMLHttpRequest();
        xhr.open( 'HEAD', _url, false );
        xhr.send();
    return xhr.status == "404" ? 0 : 1 ;
}

function check_file_syntax( _filename )
{
   // extension is not check, in order to meet filesystem standards, different from Windows
   return /^[0-9A-Za-z\.]{1,}$/.test( _filename ) ;
}

function get_filedata_from_folder( _php_url, _method, _async, _vars )
{
    if ( !window.jQuery ) return null ;
    if ( !_async )
    {
   		var _result = $.ajax({ type: _method, url: _php_url, exact: 0, data: _vars, async: false }).responseText ;
      return _result == "" ? [] : _result ;
    }
    else
    {
      $.ajax(
        {
          async: true, type: _method,
          exact: 0, url: _php_url, data: _vars,
          error: function( xhr )
          {
            var readyState = { 1: "Loading", 2: "Loaded", 3: "Interactive", 4: "Complete" };
            if( xhr.readyState !== 0 && xhr.status !== 0 && xhr.responseText !== "undefined" ) return [] ;
          },
          success: function( _result ) { return _result == "" ? [] : _result ; }
        }
      );
    }
}

function get_file_modify_date( _path_to_file, _file )
{
    var vars = { tip: "", exact: 0, folder : _path_to_file, filter : _file, search_params : '' } ;
    return get_filedata_from_folder( "support/code/phpcode/svc/svc.filelist.get.modify.datetime.php", "POST", false, vars );
}
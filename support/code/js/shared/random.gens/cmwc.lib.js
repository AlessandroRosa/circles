/* complementary multiply-with-carry */

var CMWC = function()
{
    this.PHI = 0x9e37 ;
    this.Q = new Array(4096) ;
    this.c = 362436;
}

CMWC.prototype.init_rand = function( x )
{
    var i;
    this.Q[0] = x;
    this.Q[1] = x + this.PHI;
    this.Q[2] = x + this.PHI + this.PHI;
    for (i = 3; i < 4096; i++) this.Q[i] = this.Q[i - 3] ^ this.Q[i - 2] ^ this.PHI ^ i;
}

CMWC.prototype.rand = function()
{
      var t, a = 18782 ;
      var i = 4095 ;
      var x, r = 0xff ;
      i = (i + 1) & 4095 ;
      t = a * this.Q[i] + this.c;
      this.c = (t >> 32);
      x = t + this.c;
      if (x < this.c)
      {
          x++;
          this.c++;
      }
      this.Q[i] = ( r - x ) >> 32 ;
      if ( this.Q[i] < 0 ) this.Q[i] = -this.Q[i] ;
      return this.Q[i] / ( Math.pow( 2, 31 ) ) ;
}
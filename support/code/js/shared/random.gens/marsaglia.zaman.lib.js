/* This Random Number Generator is based on the algorithm in a FORTRAN
   version published by George Marsaglia and Arif Zaman, Florida State
   University; ref.: see original comments below.
   At the fhw (Fachhochschule Wiesbaden, W.Germany), Dept. of Computer
   Science, we have written sources in further languages (C, Modula-2
   Turbo-Pascal(3.0, 5.0), Basic and Ada) to get exactly the same test
   results compared with the original FORTRAN version.
   April 1989
   Karl-L. Noell <NOELL@DWIFH1.BITNET>
      and  Helmut  Weber <WEBER@DWIFH1.BITNET>

   This random number generator originally appeared in "Toward a Universal
   Random Number Generator" by George Marsaglia and Arif Zaman.
   Florida State University Report: FSU-SCRI-87-50 (1987)
   It was later modified by F. James and published in "A Review of Pseudo-
   random Number Generators"
   THIS IS THE BEST KNOWN RANDOM NUMBER GENERATOR AVAILABLE.
   (However, a newly discovered technique can yield
   a period of 10^600. But that is still in the development stage.)
   It passes ALL of the tests for random number generators and has a period
   of 2^144, is completely portable (gives bit identical results on all
   machines with at least 24-bit mantissas in the floating point
   representation).
   The algorithm is a combination of a Fibonacci sequence (with lags of 97
   and 33, and operation "subtraction plus one, modulo one") and an
   "arithmetic sequence" (using subtraction).

   Use IJ = 1802 & KL = 9373 to test the random number generator. The
   subroutine RANMAR should be used to generate 20000 random numbers.
   Then display the next six random numbers generated multiplied by 4096*4096
   If the random number generator is working properly, the random numbers
   should be:
           6533892.0  14220222.0  7275067.0
           6172232.0  8354498.0   10633180.0
*/

var MarsagliaZamanRndGen = function()
{
    this.randU = new Array(97) ;
    this.randC = 0 ;
    this.randCD = 0 ;
    this.randCM = 0;
    this.i97 = 0 ;
    this.j97 = 0;
}

MarsagliaZamanRndGen.prototype.init = function()
{
    var _now = new Date() ;
    var _seed_1 = Math.min( _now.getMilliseconds() * _now.getSeconds() / 2, 31328 ) | 0 ;
    var _seed_2 = Math.min( Math.pow( _seed_1, 1.2 ) * _now.getSeconds(), 30081 ) | 0 ;
    this.rnd_init( _seed_1, _seed_2 );
}

MarsagliaZamanRndGen.prototype.rnd_init = function( ij, kl )
{
   var s,t;
   var ii,i,j,k,l,jj,m;

   /* Handle the seed range errors
      First random number seed must be between 0 and 31328
      Second seed must have a value between 0 and 30081 */

   if (ij < 0 || ij > 31328 || kl < 0 || kl > 30081) {
		ij = 1802;
		kl = 9373;
   }

   i = (ij / 177) % 177 + 2;
   j = (ij % 177)       + 2;
   k = (kl / 169) % 178 + 1;
   l = (kl % 169);

   for (ii=0; ii<97; ii++)
   {
      s = 0.0, t = 0.5;
      for (jj=0; jj<24; jj++)
      {
         m = (((i * j) % 179) * k) % 179;
         i = j;
         j = k;
         k = m;
         l = (53 * l + 1) % 169;
         if (((l * m % 64)) >= 32) s += t;
         t *= 0.5;
      }
      this.randU[ii] = s;
   }

   this.randC  = 362436.0 / 16777216.0;
   this.randCD = 7654321.0 / 16777216.0;
   this.randCM = 16777213.0 / 16777216.0;
   this.i97 = 97;
   this.j97 = 33;
}

MarsagliaZamanRndGen.prototype.rnd_gen = function()
{
   var uni;
   uni = this.randU[this.i97-1] - this.randU[this.j97-1];
   if (uni <= 0.0) uni++;
   this.randU[this.i97-1] = uni;
   this.i97--;
   if (this.i97 == 0) this.i97 = 97;
   this.j97--;
   if (this.j97 == 0) this.j97 = 97;
   this.randC -= this.randCD;
   if (this.randC < 0.0) this.randC += this.randCM;
   uni -= this.randC;
   if (uni < 0.0) uni++;
   return uni;
}
const RC = [0x0000000000000001n,0x0000000000008082n,0x800000000000808an,0x8000000080008000n,0x000000000000808bn,0x0000000080000001n,0x8000000080008081n,0x8000000000008009n,0x000000000000008an,0x0000000000000088n,0x0000000080008009n,0x000000008000000an,0x000000008000808bn,0x800000000000008bn,0x8000000000008089n,0x8000000000008003n,0x8000000000008002n,0x8000000000000080n,0x000000000000800an,0x800000008000000an,0x8000000080008081n,0x8000000000008080n,0x0000000080000001n,0x8000000080008008n];
const ROT = [[0,36,3,41,18],[1,44,10,45,2],[62,6,43,15,61],[28,55,25,21,56],[27,20,39,8,14]];
const M64=(1n<<64n)-1n;
const rotl=(x,n)=>n===0n?x:((x<<n)|(x>>(64n-n)))&M64;
function keccakF(s){
  for(let round=0;round<24;round++){
    const c=[0n,0n,0n,0n,0n];
    for(let x=0;x<5;x++) c[x]=s[x]^s[x+5]^s[x+10]^s[x+15]^s[x+20];
    for(let x=0;x<5;x++){ const d=c[(x+4)%5]^rotl(c[(x+1)%5],1n); for(let y=0;y<25;y+=5) s[x+y]^=d; }
    const b=new Array(25).fill(0n);
    for(let x=0;x<5;x++) for(let y=0;y<5;y++) b[y+5*((2*x+3*y)%5)]=rotl(s[x+5*y],BigInt(ROT[x][y]));
    for(let x=0;x<5;x++) for(let y=0;y<25;y+=5) s[y+x]=b[y+x]^((~b[y+(x+1)%5]&M64)&b[y+(x+2)%5]);
    s[0]^=RC[round];
  }
  return s;
}
export function keccak256(input){
  const data=Buffer.from(typeof input==='string'?input:Buffer.from(input));
  const rate=136;
  const padded=Buffer.alloc(Math.ceil((data.length+1)/rate)*rate);
  data.copy(padded); padded[data.length]^=0x01; padded[padded.length-1]^=0x80;
  const s=new Array(25).fill(0n);
  for(let off=0;off<padded.length;off+=rate){
    for(let i=0;i<rate/8;i++) s[i]^=padded.readBigUInt64LE(off+i*8);
    keccakF(s);
  }
  const out=Buffer.alloc(32);
  for(let i=0;i<4;i++) out.writeBigUInt64LE(s[i],i*8);
  return '0x'+out.toString('hex');
}

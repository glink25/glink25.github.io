let a;const t=async()=>a||(a=await(await fetch(`${location.origin}/api/post/list`)).json(),a);export{t as g};

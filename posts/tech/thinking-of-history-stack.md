## 撤销回退历史记录功能的思考

如果要实现一个历史记录功能，支持撤销和重做操作，例如正确地打印下面的代码，要如何实现呢
```typescript
// test
const stack = createStack(1);
const print = () => console.log('current: ', stack.current(), ' canRedo: ', stack.canRedo(), ' canUndo: ', stack.canUndo());
console.log('stack created with 1:');
print(); // current 1, canRedo: false, canUndo: false
console.log('stack save 2:');
stack.save(2);
print(); // current 2, canRedo: false, canUndo: true
console.log('stack undo:');
stack.undo();
print(); // current 1, canRedo: true, canUndo: false
console.log('stack save 3:');
stack.save(3);
print(); // current 3, canRedo: false, canUndo: true
console.log('stack undo:');
stack.undo();
print(); // current 3, canRedo: false, canUndo: true
```

首先想到的是使用两个数组作为记录栈和重做栈，每次undo操作，相当于从记录栈里取出最后一个放入重做栈，而每次redo就相当于从重做栈取出第一个放回到记录栈中，与undo正好相反，最后，调用save时需要清空重做栈，通过两个栈的长度来判断是否可以undo和redo，如下：
```typescript
const createStack=<T>(init:T)=>{
    let INITIAL=[init]
    let stack=[...init]
    let redoStack=[]


    const canUndo=()=>stack.length>INITIAL.length

    const canRedo=()=>redoStack.length>0

    const undo=()=>{
        if(!canUndo())return
        const latest=stack.pop();
        if(latest)redoStack.push(latest)
    }

    const redo=()=>{
        if(!canRedo())return
        const latest=redoStack.pop();
        if(latest)stack.push(latest)
    }

    const save=(v:T)=>{
        redoStack=[]
        stack.push(v)
    }
    // 表示取stack最后一个元素
    const current=()=>stack.at(-1)

    return{
        undo,redo,canUndo,canRedo,save
    }
}
```

这样就是一个简单的历史记录功能的实现了，当然还有很多没有考虑的地方，例如没有使用深拷贝，会导致某些时候外部修改了current的引用时同时修改历史记录元素，不过这里只针对基本类型而非引用类型，基本逻辑还是完善的。如果需要提高泛用性，引入某个deepClone函数把每次操作都深拷贝一次就可以了。

这里使用到了两个数组来存储，还有一种更优的方法是使用一个数组加指针，指针指向最数组的末尾，每次undo或者redo相当于指针-1或者+1，而save则是裁剪数组指针的长度，再把新元素放到数组末尾，然后指针+1，整个逻辑也十分直观：
```typescript
const createStack=<T>(init:T)=>{
    let INITIAL=[init]
    let stack=[...init]
    let cursor=stack.length-1

    const canUndo=()=> cursor>0

    const canRedo=()=> cursor<stack.length-1

    const undo=()=>{
        if(!canUndo())return
        cursor -= 1
    }

    const redo=()=>{
         if(!canRedo())return
        cursor += 1
    }


    const save=(v:T)=>{
        stack=stack.slice(0, cursor+1)
        cursor += 1
    }
    // 等同于 stack[cursor]
    const current=()=>stack.at(cursor)

    return{
        undo,redo,canUndo,canRedo,save
    }
}
```

这样就少用了一个数组，降低了一点空间复杂度，减少了一点push、pop的时间，但是提高了我们的代码优雅度（划掉）

有没有办法再优雅一点呢？这里还是用到了好几个可变变量，我们把它们去掉，换成纯函数的写法
```typescript
const createStack=<T>(initialStack:T[])=>{
    const stack=[...initialStack]
    const cursor=stack.length-1
    const canUndo=()=> cursor > 0
    const canRedo=()=> cursor < stack.length-1
    return {
        current:()=> stack.at(cursor),
        undo:()=> canUndo() ? createStack(stack,cursor-1) : undefined,
        redo:()=> canRedo() ? createStack(stack,cursor+1) : undefined,
        save:()=> createStack(stack.slice(0,cursor+1),cursor-1),
        canUndo,
        canRedo
    }
}
```
是不是更加精致简洁了？不过这样会修改测试用例的调用方法，让我们对它做一个封装，在不修改测试用例的情况下保持兼容：
```typescript
const _create=<T>(initialStack:T[])=>{
    const stack=[...initialStack]
    const cursor=stack.length-1
    const canUndo=()=> cursor > 0
    const canRedo=()=> cursor < stack.length-1
    return {
        current:()=> stack.at(cursor),
        undo:()=> canUndo() ? createStack(stack,cursor-1) : undefined,
        redo:()=> canRedo() ? createStack(stack,cursor+1) : undefined,
        save:()=> createStack(stack.slice(0,cursor+1)),
        canUndo,
        canRedo
    }
}

const createStack=<T>(init:T)=>{
    let stack=_create([init])
    return {
        current:()=>stack.current(),
        undo:()=>stack=stack.undo() ?? stack,
        redo:()=>stack=stack.redo() ?? stack,
        save:(v:T)=>stack=stack.save(v)
        canRedo:()=>stack.canRedo()
        canUndo:()=>stack.canUndo()
    }
}
```

虽然代码分成了两部分，好像更长了，不过我们用上了纯函数，整个代码健壮性又增加了（划掉）
如果考虑实用性，还需要对创建stack和调用current时做好深拷贝，还可以限制最大历史记录长度等等。
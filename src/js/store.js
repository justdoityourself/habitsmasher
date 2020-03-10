export let store = function(name)
{
    var that = this;
    this.name = name;
    this.object = "root";
    this.db = undefined;

    this.timings = 
    {
        latency:
        {
            get:
            {
                total:0,
                count:0,
                avg(){return (that.timings.latency.get.count) ? that.timings.latency.get.total/that.timings.latency.get.count : 0;}
            },
            set:
            {
                total:0,
                count:0,
                avg(){return (that.timings.latency.set.count) ? that.timings.latency.set.total/that.timings.latency.set.count : 0;}
            },
            del:
            {
                total:0,
                count:0,
                avg(){return (that.timings.latency.del.count) ? that.timings.latency.del.total/that.timings.latency.del.count : 0;}
            }
        }
    };

    this.performance_report = ()=>
    {
        return {
            startup:this.timings.startup,
            get:
            {
                t:this.timings.latency.get.total,
                c:this.timings.latency.get.count,
                a:this.timings.latency.get.avg()
            },
            set:
            {
                t:this.timings.latency.set.total,
                c:this.timings.latency.set.count,
                a:this.timings.latency.set.avg()
            },
            del:
            {
                t:this.timings.latency.del.total,
                c:this.timings.latency.del.count,
                a:this.timings.latency.del.avg()
            }
        };
    };

    this.startup=function(cb)
    {
        if(!that.db)
        {
            let start = Date.now();

            var ev = indexedDB.open(that.name, 1);
            ev.onupgradeneeded = () => { that.db = ev.result; that.store = that.db.createObjectStore(that.object, {keyPath: "id"}); };

            ev.onerror = function() { alert("IndexedDB: " + that.name + " denied access."); }

            ev.onsuccess = () => { that.timings.startup = Date.now()-start; that.db = ev.result; cb(); }
        }
        else cb();
    };
    this.clear = function(cb)
    {
        that.db = undefined;
        var d = indexedDB.deleteDatabase(that.name); d.oncomplete = cb; d.onblocked = cb;
    };
    this.del=function(k,cb) 
    { 
        var a,q;
        var p = new Promise((_a,_q)=>{a=_a;q=_q;});
        that.startup(()=> 
        { 
            let start = Date.now();
            let r = that.db.transaction([that.object],"readwrite").objectStore(that.object).delete(k);
            r.onsuccess = e => 
            {
                that.timings.latency.del.total += Date.now() - start;
                that.timings.latency.del.count++;

                if(cb) cb(e.target);
                a();
            } 
            r.onerror = q;
        }); 

        return p;
    };
    this.get=function(k,cb) 
    { 
        var a,q;
        var p = new Promise((_a,_q)=>{a=_a;q=_q;});
        that.startup(()=> 
        { 
            let start = Date.now();
            let req = that.db.transaction([that.object]).objectStore(that.object).get(k);
            req.onsuccess = e => 
            { 
                that.timings.latency.get.total += Date.now() - start;
                that.timings.latency.get.count++;

                var r = ('result' in e.target && e.target.result) ? e.target.result.payload : undefined; 
                if(cb) cb(r);
                a(r);
            } 
            req.onerror = q;
        }); 
        return p;
    };
    this.count= (cb)=> 
    {
        var a,q; var p = new Promise((_a,_q)=>{a=_a;q=_q;});
        that.startup(()=> 
        { 
            let req = that.db.transaction([that.object]).objectStore(that.object).count();
            req.onsuccess= e =>
            {
                if(cb)cb(e.result);
                a(e.result);
            }
            req.onerror = q;
        } ); 

        return p;
    };
    this.iterate=(cb)=>
    {
        var a,q; var p = new Promise((_a,_q)=>{a=_a;q=_q;});
        that.startup(()=> 
        { 
            var tr = that.db.transaction([that.object],'readonly');
            let req = tr.objectStore(that.object).count().openCursor();
            req.onsuccess = e=>
            {
                if (e.target.result)
                {
                    cb(e.target.result.value);
                    e.target.result['continue']();
                }
            }

            req.onerror = q;
            tr.oncomplete = a;
        } ); 

        return p;
    };
    this.set=function(k,v,cb) 
    { 
        var a,q;
        var p = new Promise((_a,_q)=>{a=_a;q=_q;});
        that.startup(()=> 
        { 
            let start = Date.now();
            let req = that.db.transaction([that.object],"readwrite").objectStore(that.object).put({id: k, payload: v});
            req.onsuccess= () =>
            {
                that.timings.latency.set.total += Date.now() - start;
                that.timings.latency.set.count++;

                if(cb)cb();
                a();
            }

            req.onerror = q;
        } ); 

        return p;
    };
    this.getl=function(kl,cb)
    {
        var a/*,q*/; var p = new Promise((_a/*,_q*/)=>{a=_a;/*q=_q;*/});
        if(!kl.length)
        {
            cb([]);
            a();
            return p;
        }

        that.startup(()=> 
        {
            var s = that.db.transaction([that.object]).objectStore(that.object);
            var r = [];

            for(var i = 0, c = 0; i < kl.length; i ++)
            {
                var op = s.get(kl[i]);
                op.onsuccess = e=> 
                { 
                    if(!e.target.result) r.push(""); 
                    else r.push(e.target.result.payload); 
                    if(++c == kl.length) 
                    { a(r); if(cb)cb(r); } 
                };
                op.onerror = ()=> 
                { 
                    r.push(""); 
                    if(++c == kl.length) 
                    { 
                        a(r); if(cb) cb(r); 
                    } 
                };
            }
        });

        return p;
    };
    this.setl=function(kvl,cb)
    {
        var a/*,q*/; var p = new Promise((_a/*,_q*/)=>{a=_a;/*q=_q;*/});
        if(!kvl.length)
        {
            cb([]);
            a();
            return p;
        }

        that.startup(
        ()=> {
            var s = that.db.transaction([that.object],"readwrite").objectStore(that.object);
            var r = [];

            for(var i = 0, c = 0; i < kvl.length; i ++)
            {
                var op = s.put({id: kvl[i][0], payload: kvl[i][1]});
                op.onsuccess = ()=> 
                { 
                    r.push("okay"); 
                    if(++c == kvl.length) { a(r); if(cb) cb(r);} 
                };
                op.onerror = ()=> 
                { 
                    r.push("fail"); 
                    if(++c == kvl.length) 
                    { a(r); if(cb)cb(r);} 
                };
            }
        });
        return p;
    }
}

export let common = new store("store");
//# sourceURL=nstore.js
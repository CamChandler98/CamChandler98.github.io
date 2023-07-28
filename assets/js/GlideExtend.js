

const Continuous = (Glide, Components, Events) => {

    
      
    const Continuous = {
        interval:null,
        enabled:false,
        scrollValue:0,
        increment:20,
        

        mount(){
            
            this.bind()

            Events.emit('Continuous.mount')
            console.log('Example component has been mounted.')
        },
        

        move(event){
            if (!Glide.disabled) {
 
                if (this.enabled) {
        
                  event.stopPropagation()
                    
                  this.scrollValue += this.increment
                  Components.Move.make(this.scrollValue)
                //   Components.Run.make(`=${Components.Move.value}`)
                
                //   console.log(`move: ${Components.Run.calculate()}`)
        
                //   Components.Html.root.classList.add(classes.dragging)
        
                  Events.emit('swipe.move')

                } else {
                  return false
                }
              }
        },


        startContinuous()
        {
        
            {
                this.enabled = true;
                console.log('start')
            }
        },

        stopContinuous()
        {
            console.log('stop')
            this.enabled = false;
        },

        bind(){
            console.log('bindstop')
            
            Components.Html.root.querySelector('.glide__track').addEventListener('mouseover' , ()=> {
                this.stopContinuous();
            })
            Components.Html.root.querySelector('.glide__track').addEventListener('addclone' , ()=> {
                console.log('here clone')
                Components.Clones.append()
            })
            Components.Html.root.querySelector('.glide__track').addEventListener('click' , ()=> {
                this.stopContinuous();
            })

            Components.Html.root.querySelector('.glide__track').addEventListener('mouseout' , ()=> {

                // this.startContinuous();
            })
            
            
            console.log('bindmove')
            // Components.Html.root.querySelector('.glide__track').addEventListener('moveslide' , (e)=> {
            //     console.log('calling')
            //     this.move(e);
            // })

        }
    

    }

    Events.on('mount.before' , ()=> {
        console.log('before mount')
        Continuous.bind()

    })

    Events.on('mount.after', ()=> {

        console.log('staart con')
        Continuous.startContinuous()
        // Continuous.bind()

    })
    return Continuous
}
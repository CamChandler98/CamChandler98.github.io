document.addEventListener("DOMContentLoaded", () => {

    let audioVideos = document.querySelectorAll('.audio-option');
    // debugger
    audioVideos.forEach(videoEl => {
        videoEl.volume = '0.5'
        let parent = videoEl.parentElement

        let audioButton = parent.querySelector('.divider-music');
        let slider = parent.querySelector('input')
        let indicator =  audioButton.querySelector('.indicator')


        slider.addEventListener('input', (e) => {
            let vol = e.target.value

            videoEl.volume = vol
        })
        // debugger
        audioButton.childNodes.forEach(child => {

            child.addEventListener('click', () => {

                if(videoEl.muted)
                {
                    videoEl.muted = false;
                    slider.style.visibility = 'visible'
                    indicator.classList.remove('fa-times')
                    indicator.classList.add('fa-music')

                }
                else
                {
                    videoEl.muted = true;
                    slider.style.visibility = 'hidden'
                    indicator.classList.add('fa-times')
                    indicator.classList.remove('fa-music')
                }
                // debugger
            })
        })
    })


    $('.portfolio-modal').on('hide.bs.modal', (e) => {

        let modal = e.currentTarget;
        
        let videoEl = modal.querySelector('video')

        videoEl.paused = true;

    })
    $('.portfolio-modal').on('show.bs.modal', (e) => {

        let modal = e.currentTarget;
        
        let videoEl = modal.querySelector('video')

        videoEl.paused = false;

    })

    $('.video-modal').on('hide.bs.modal', (e) => {

        let modal = e.currentTarget;
        
        let videoEl = modal.querySelector('.audio-option')

        let parent = videoEl.parentElement

        let audioButton = parent.querySelector('.divider-music');
        let slider = parent.querySelector('input')
        let indicator =  audioButton.querySelector('.indicator')

        videoEl.muted = true;
        slider.style.visibility = 'hidden'
        indicator.classList.add('fa-times')
        indicator.classList.remove('fa-music')
    })


})
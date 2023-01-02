const uploaderIcon = document.querySelector('.uploaderIcon');
const profilePicture = document.querySelector('.profilePicture');
const uploader = document.getElementById('profilePicUpload');

uploader.addEventListener('change', (event) => {
    if(event.target.files.length !== 0){
        let src = URL.createObjectURL(event.target.files[0]);
        profilePicture.src = src;
        uploaderIcon.style.opacity = 0;
    }
})
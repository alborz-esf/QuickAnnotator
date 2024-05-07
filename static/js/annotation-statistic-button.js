document.addEventListener("DOMContentLoaded", function() {
    const statisticsLink = document.getElementById("statisticsLink");
    if (statisticsLink) {
        statisticsLink.addEventListener("click", function(event) {
            event.preventDefault();
            
            const options = [
                "Label",
                "Centroid",
                "Orientation",
                "Eccentricity",
                "Perimeter",
                "Area",
                "Minor_Axis_Length",
                "Major_Axis_Length"
            ]; 
            
            let html = '';
            for (const option of options) {
                html += `<h3>${option} <input type="checkbox" id="${option.toLowerCase()}" /></h3><p/>`;
            }
            
            Swal.fire({
                title: 'Statistical options',
                html: html,
                confirmButtonText: 'Confirmar',
                preConfirm: () => {
                    const values = {};
                    for (const option of options) {
                        const checkbox = Swal.getPopup().querySelector(`#${option.toLowerCase()}`);
                        values[option.toLowerCase()] = checkbox.checked;
                    }
                    return values;
                }
            }).then((result) => {
                const selectedOptions = Object.keys(result.value).filter(option => result.value[option]);
                const url = window.location.href;
                const parts = url.split('/');
                parts.pop();
                const imageName = parts.pop(); // Get the last part of the URL as the image name
                const projectName = parts.pop(); // Get the second last part of the URL as the project name
                
                // console.log('Selected Options:', selectedOptions);
                // console.log('Project Name:', projectName);
                // console.log('Image Name:', imageName);
                
                // Make POST request to API with selected options
                fetch(`/api/${projectName}/image/${imageName}/mask/get_statistics`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ selectedOptions: selectedOptions })
                })
                .then(response => response.blob())
                .then(blob => {
                    const downloadLink = document.createElement('a');
                    downloadLink.href = window.URL.createObjectURL(blob);
                    downloadLink.download = `${projectName}_annotation_selected_statistics.csv`;
                    downloadLink.click();
                })
                .catch(error => console.error('Error:', error));
            });
        
        });
    }
});

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
                "Major_Axis_Length",
                "All"
            ]; 
            
            let html = '';
            for (const option of options) {
                if (option === "All") {
                    html += `<h3>${option} <input type="checkbox" id="${option.toLowerCase()}" class="check-all" /></h3><p/>`;
                } else {
                    html += `<h3>${option} <input type="checkbox" id="${option.toLowerCase()}" /></h3><p/>`;
                }
            }
            
            Swal.fire({
                title: 'Statistical options',
                html: html,
                confirmButtonText: 'Confirmar',
                preConfirm: () => {
                    const values = {};
                    const checkAll = document.getElementById("all");
                    const checkAllValue = checkAll ? checkAll.checked : false;
                    for (const option of options) {
                        if (option === "All") continue;
                        const checkbox = Swal.getPopup().querySelector(`#${option.toLowerCase()}`);
                        values[option.toLowerCase()] = checkAllValue || checkbox.checked;
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

            const checkAllCheckbox = document.getElementById("all");
            if (checkAllCheckbox) {
                checkAllCheckbox.addEventListener("change", function() {
                    const otherCheckboxes = document.querySelectorAll('input[type="checkbox"]:not(.check-all)');
                    otherCheckboxes.forEach(checkbox => {
                        checkbox.checked = checkAllCheckbox.checked;
                    });
                });
            }
        
        });
    }
});

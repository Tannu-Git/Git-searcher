function fetchData(username) {
    fetch(`https://api.github.com/users/${username}`)
        .then(response => {
            if (response.status === 403) {
            alert('Daily limit exceeded');
            throw new Error('Rate limit exceeded');}
            return response.json()} )
        .then(data => {
            console.log(data);
            console.log(data.name)
            setInterval(function() {
            let currentDateTime = new Date();
            $('.current').text(currentDateTime);
            }, 1000);
            $('.person-name').text(data.name ? data.name : data.login);
            $('.person-mail').text(data.email ? data.email : 'Not given');
            $('.person-dob').text(data.dob ? data.name : 'Not given');
            $('.pub-repo').text(data.public_repos ? data.public_repos : '0');
            $('.followers').text(data.followers ? data.followers : '0');
            $('.following').text(data.following ? data.following : '0');
            $('.created').text('Created at: ' + (data.created_at ? data.created_at : 'Not given'));
            $('.update').text('Updated at: ' + (data.updated_at ? data.updated_at : 'Not given'));
            $('.avatar').attr('src', data.avatar_url ? data.avatar_url : 'pexels-simon-robben-614810.jpg');
        })
        .catch(error => console.error('Error:', error));
}

document.querySelector('.form-inline').addEventListener('submit', function(e) {
    e.preventDefault();
    let username = document.querySelector('.form-control').value;
    fetchData(username);
});

// Fetch data for 'apple' by default
fetchData('apple');


function searchUsers(query) {
    fetch(`https://api.github.com/search/users?q=${query}&per_page=5`)
        .then(response => response.json())
        .then(data => {
            let dropdown = document.querySelector('.dropdown-menu');
            dropdown.innerHTML = ''; // Clear the dropdown
            if (data.items.length > 0) {
                dropdown.classList.add('show'); // Show the dropdown
            } else {
                dropdown.classList.remove('show'); // Hide the dropdown
            }
            data.items.forEach(user => {
                fetch(user.url)
                    .then(response => response.json())
                    .then(userData => {
                        if (!userData) {
                            console.error('userData is undefined');
                            return;
                        }
                        let item = document.createElement('a');
                        item.href = '#';
                        item.className = 'dropdown-item';
                        item.textContent = userData.login;
                        item.addEventListener('click', function() {
                            fetchData(userData.login);
                            document.querySelector('.form-control').value = ''; // Clear the search bar
                            dropdown.innerHTML = ''; // Clear the dropdown
                            dropdown.classList.remove('show'); // Hide the dropdown
                        });
                        dropdown.appendChild(item);
                    })
                    .catch(error => console.error('Error:', error));
            });
        })
        .catch(error => console.error('Error:', error));
}

document.querySelector('.form-control').addEventListener('input', function(e) {
    let query = e.target.value;
    if (query.length > 2) { // Only search if the query is at least 3 characters long
        searchUsers(query);
    } else {
        let dropdown = document.querySelector('.dropdown-menu');
        dropdown.classList.remove('show'); // Hide the dropdown
    }
});
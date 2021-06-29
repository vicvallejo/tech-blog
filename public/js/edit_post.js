async function editFormHandler(event) {
    event.preventDefault();

    const title = document.querySelector('#post_titulo').value.trim();
    const content = document.querySelector('#post_contenido').value.trim();
    console.log(title);
    console.log(content);

    const id = document.querySelector('#edit_btn').value;
      
      const response = await fetch(`/api/posts/edit`, {
        method: 'PUT',
        body: JSON.stringify({
          id,
          title,
          content
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        document.location.replace('/dashboard/');
      } else {
        alert(response.statusText);
      }

}

document.querySelector('#edit_btn').addEventListener('click', editFormHandler);


async function deleteFormHandler(event) {
  event.preventDefault();

  const id = document.getElementById('delete_btn').value;
  console.log(id);
    const response = await fetch(`/api/posts/delete`, {
      method: 'DELETE',
      body: JSON.stringify({
        id
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      document.location.replace('/dashboard/');
    } else {
      alert(response.statusText);
    }
    
}

document.querySelector('#delete_btn').addEventListener('click', deleteFormHandler);
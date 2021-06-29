async function commentFormHandler(event) {
    event.preventDefault();

    const comment_text = document.querySelector('#comment').value.trim();
    const post_id = document.querySelector('#comments_btn').value;

    if (comment_text) {
        const response = await fetch('/api/comments/', {
            method: 'POST',
            body: JSON.stringify({
                post_id,
                comment_text
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            document.location.reload();

        } else {
            alert(response.statusText);
            document.querySelector('#comment-form').style.display = "block";
        }
    }
}

document.querySelector('#comments_btn').addEventListener('click', commentFormHandler);
import { Editor } from '@tinymce/tinymce-react';

export default function TextEditor({editorRef, defaultValue}) {
  return (
    <>
      <Editor
        apiKey="32ne23x277g7cdbgy01eos5p0f9hlaz55et1nzrf4rra50dl"
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue={defaultValue}
        init={{
          height: 500,
          menubar: false,
          plugins:
            "advlist autolink lists link image charmap preview anchor searchreplace visualblocks insertdatetime media table code help wordcount fullscreen emoticons codesample",
          toolbar:
            "undo redo | formatselect | " +
            "bold italic backcolor | alignleft aligncenter alignright alignjustify |" +
            "bullist numlist outdent indent | image media emoticons link codesample charmap hr |" +
            "removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          file_picker_types: "image media",
          file_picker_callback: function (cb, value, meta) {
            var input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');

            /*
              Note: In modern browsers input[type="file"] is functional without
              even adding it to the DOM, but that might not be the case in some older
              or quirky browsers like IE, so you might want to add it to the DOM
              just in case, and visually hide it. And do not forget do remove it
              once you do not need it anymore.
            */

            input.onchange = function () {
              var file = this.files[0];

              var reader = new FileReader();
              reader.onload = function () {
                /*
                  Note: Now we need to register the blob in TinyMCEs image blob
                  registry. In the next release this part hopefully won't be
                  necessary, as we are looking to handle it internally.
                */
                var id = 'blobid' + (new Date()).getTime();
                var blobCache =  tinymce.activeEditor.editorUpload.blobCache;
                var base64 = reader.result.split(',')[1];
                var blobInfo = blobCache.create(id, file, base64);
                blobCache.add(blobInfo);

                /* call the callback and populate the Title field with the file name */
                cb(blobInfo.blobUri(), { title: file.name });
              };
              reader.readAsDataURL(file);
            };

            input.click();
          },
        }}
      />
    </>
  );
}

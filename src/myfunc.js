export function localeDateTime(val) {
    if (val == '') { return ''};
      const d = new Date(val);
      return  d.toLocaleDateString() +'  '+ String(d.getHours()).padStart(2, '0')+':' + String(d.getMinutes()).padStart(2, '0') }

export function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  } 
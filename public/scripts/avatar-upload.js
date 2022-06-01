export const uploadImage = (file) => {
    if (file.size > 1024 * 1024 * MAX_AVI_SIZE) {
        setMessage(`Image size cannot exceed ${MAX_AVI_SIZE} MB!`)
    }
    else {
        file.arrayBuffer().then(buffer => {
            socket.emit('updateCharacter', {field: buffer, fieldName: 'avi', characterId: character._id, isNpc: character.isNpc})
        })
    }
}

export const getAviUrl = (character) => {
    if (character.avi) {
        let bytes = character.avi.data
        let encodedBytes = btoa(String.fromCharCode(...bytes));
        let aviUrl = "data:image/jpg;base64," + encodedBytes
        return aviUrl
    }
    else return meowcon
}
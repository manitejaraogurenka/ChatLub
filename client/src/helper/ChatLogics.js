const getSender = (loggeduser, users) => {
  return users[0]._id === loggeduser.id ? users[1] : users[0];
};

export default getSender;

export const isSameSender = (messages, message, index, userId) => {
  return (
    index < messages.length - 1 &&
    (messages[index + 1].sender._id !== message.sender._id ||
      messages[index + 1].sender._id === undefined) &&
    messages[index].sender._id !== userId
  );
};

export const isFirstMessage = (messages, index, userId) => {
  return (
    index === messages.length - 1 &&
    messages.length > 0 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

export const isSameSenderPosition = (messages, m, i, userId) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return true;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return false;
  else return false;
};

export const isSameUser = (messages, message, index) => {
  return index > 0 && messages[index - 1].sender._id === message._id;
};

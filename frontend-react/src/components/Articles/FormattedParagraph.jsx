

// components/FormattedParagraph.jsx
export default function FormattedParagraph({ text }) {
    return (
      <div className="w-full space-y-6">
        {text.split('\n').map((paragraph, idx) => {
          const isNumbered = /^\d+\.\s/.test(paragraph);
          
          const sharedStyle = {
            whiteSpace: 'pre-wrap',  // שימור הרווחים והטאבים
            wordBreak: 'break-word', // מבטיח ששורות לא יגלשו
          };
  
          if (isNumbered) {
            return (
              <ol key={idx} className="list-decimal ml-6 ">
                <li
                  className="pl-6 text-lg lg:text-2xl"
                  style={sharedStyle}
                >
                  {paragraph.replace(/^\d+\.\s*/, '')}
                </li>
              </ol>
            );
          } else {
            return (
              <p
                key={idx}
                className="text-lg lg:text-2xl"
                style={sharedStyle}
              >
                {paragraph}
              </p>
            );
          }
        })}
      </div>
    );
  }
  
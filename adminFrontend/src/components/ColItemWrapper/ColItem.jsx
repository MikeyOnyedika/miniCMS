import Styles from './styles.module.css'

export const ColItem = ({ item }) => {
  return (
    <div key={item._id} className={Styles.ColItem}>
      {
        // loop through the props of the item object so we can create an item value prop from each prop
        Object.keys(item).map((prop, index) => {
          return (
            <div key={index} className={Styles.ColItem__PropValue}>
              <span className={Styles.PropValue__Prop}>{prop}:</span>
              {
                // recursively handle nested object
                (item[prop] instanceof Object && item[prop] instanceof Array === false) ?
                  (
                    <details>
                      <summary>{"Object"}</summary>
                      <ColItem item={item[prop]} />
                    </details>
                  ) :
                  (
                    (item[prop] == null) ? (
                      // render a empty string if the value is null
                      ""
                    ) : (
                      <p>
                        {item[prop].toString()}
                      </p>
                    )
                  )
              }
            </div>
          )
        })
      }
    </div >
  )
}

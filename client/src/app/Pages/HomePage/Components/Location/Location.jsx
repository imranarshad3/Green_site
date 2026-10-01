import { Clock, MapPin, Navigation } from "lucide-react";
import "./Location.css";
import { DIRECTIONS_URL, MAP_EMBED_URL, STORE } from "../../../../utils/storeInfo";

function Location() {
  return (
    <section className="hm-section hm-location">
      <div className="hm-container hm-location-inner">
        <div className="hm-location-map">
          <iframe
            title="Map showing the Plantify studio"
            src={MAP_EMBED_URL}
            loading="lazy"
            allowFullScreen
          />
        </div>

        <div className="hm-location-card">
          <span className="hm-eyebrow">Visit us</span>
          <h2 className="hm-title">
            Come say <em>hello.</em>
          </h2>

          <ul className="hm-location-details">
            <li>
              <MapPin size={18} strokeWidth={1.6} />
              <span>
                {STORE.addressLines[0]}
                <br />
                {STORE.addressLines[1]}
              </span>
            </li>
            <li>
              <Clock size={18} strokeWidth={1.6} />
              <span>{STORE.hours}</span>
            </li>
          </ul>

          <a
            href={DIRECTIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hm-button hm-button--dark"
          >
            <Navigation size={16} />
            Get directions
          </a>
        </div>
      </div>
    </section>
  );
}

export default Location;

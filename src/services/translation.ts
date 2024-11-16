import i18next from "i18next";

import en from "../../resources/translations/en.json";

export class translation {
  public static setup(): void {
    const resources = {
      "en-US": { translation: en },
    };

    i18next.init({
      lng: "en-US",
      resources: resources,
      interpolation: {
        escapeValue: false,
      },
    });
  }
}

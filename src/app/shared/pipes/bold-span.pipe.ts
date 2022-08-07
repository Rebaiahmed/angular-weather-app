import { Pipe, PipeTransform, SecurityContext } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Pipe({
  name: "boldSpan",
  pure: false,
})
export class BoldSpanPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string, regex): any {
    return this.sanitize(this.replace(value, regex));
  }

  replace(str, regex) {
    if (str) {
      return str.replace(new RegExp(`(${regex})`, "gi"), "<b>$1</b>");
    } else {
      return "";
    }
  }

  sanitize(str) {
    return this.sanitizer.sanitize(SecurityContext.HTML, str);
  }
}

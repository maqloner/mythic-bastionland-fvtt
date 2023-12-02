/**
 * @extends {ChatMessage}
 */
export class MBChatMessage extends ChatMessage {
  /** @override */
  async getHTML() {
    const html = await super.getHTML();
    if (this.flags.cssClasses) {
      html.addClass(this.flags.cssClasses);
    }
    return html;
  }
}

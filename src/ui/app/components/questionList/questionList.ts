import { IQuestion } from "questions";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import "./questionList.scss";

@Component({
    template: require("./questionList.html"),
})
export class QuestionListComponent extends Vue {
    @Prop()
    questions: IQuestion[];

    get questionWithDetails() {
        return this.questions
            .filter((q) => this.$store.getters.requestById(q.id) !== null)
            .map((q) => ({
                id: q.id,
                request: this.$store.getters.requestById(q.id),
                question: q.question,
                options: q.options,
            }));
    }

    respond(questionId: number, result: any) {
        this.$store.dispatch("respondToQuestion", {
            questionId: questionId,
            result: result,
        });
    }
}

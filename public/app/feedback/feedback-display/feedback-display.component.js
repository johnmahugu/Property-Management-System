"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var feedback_service_1 = require("../../services/feedback-service");
var core_1 = require("@angular/core");
var FeedbackDisplayComponent = (function () {
    function FeedbackDisplayComponent(feedbackService) {
        this.feedbackService = feedbackService;
    }
    FeedbackDisplayComponent.prototype.ngOnInit = function () {
        this.feedback = [];
        this.shouldShowFeedback = false;
        this.showHide = 'Покажи';
    };
    FeedbackDisplayComponent.prototype.showFeedback = function () {
        var _this = this;
        if (this.shouldShowFeedback) {
            this.shouldShowFeedback = false;
            this.showHide = 'Покажи';
        }
        else {
            this.feedbackService.getFeedback()
                .subscribe(function (x) {
                _this.feedback = x;
                _this.shouldShowFeedback = true;
                _this.showHide = 'Скрий';
            });
        }
    };
    return FeedbackDisplayComponent;
}());
FeedbackDisplayComponent = __decorate([
    core_1.Component({
        selector: 'feedback-display',
        templateUrl: '/app/feedback/feedback-display/feedback-display.component.html',
        styleUrls: [
            'app/feedback/feedback-display/feedback-display.component.css'
        ],
        providers: [
            feedback_service_1.FeedbackService
        ]
    }),
    __metadata("design:paramtypes", [feedback_service_1.FeedbackService])
], FeedbackDisplayComponent);
exports.FeedbackDisplayComponent = FeedbackDisplayComponent;
//# sourceMappingURL=feedback-display.component.js.map